import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import SpriteBuilder, {IMAGE_WATER, IMAGE_WORM_BODY, IMAGE_WORM_BUTT} from "../builder/SpriteBuilder";
import {STRATEGY_WATER, STRATEGY_WORM} from "../controller/SpriteController";

const WATER_TIMEOUT = 3000;
const WATER_FALL_TIMEOUT = 500;
const WATER_UNIT_SIZE = 0.1;

export default class WaterStrategy extends SpriteControllerStrategy {
	insideUp;

	constructor(game, model, controls) {
		super(game, model, controls, WATER_TIMEOUT);

		this.turningEnabled = false;

		if (!this.model.data.amount) {
			this.model.data.amount = this.model.image.scale.get();
		}
		if (this.model.data.inside === undefined) {
			this.model.data.inside = false;
		}
		if (this.model.data.inside) {
			this.timeout = 0;
		}
		if (this.model.data.insideUp === undefined) {
			this.model.data.insideUp = true;
		}

		this.lastPlantNode = null;
		this.lastSpawn = null;
	}

	activateInternal() {
		this.timeout = 0;
	}

	spawn() {
		const spriteBuilder = new SpriteBuilder(this.level);
		this.lastSpawn = spriteBuilder.addSprite(this.position, WATER_UNIT_SIZE, false, this.model.image.rotation.get(), IMAGE_WATER, STRATEGY_WATER, {amount:WATER_UNIT_SIZE, inside: true, insideUp:this.model.data.insideUp });
		this.model.data.amount -= WATER_UNIT_SIZE;
		this.model.makeDirty();
		return this.lastSpawn;
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount && node !== this.lastSpawn) {
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.level.sprites.remove(node);
			this.chessboard.removeVisitor(this.position, node);
		}
	}

	selectTargetInternal() {
		if (!this.level.isValidPosition(this.position)) {
			this.level.sprites.remove(this.model);
			return;
		}

		const down = this.grid.getNeighborDown(this.position);
		if (!this.level.isGround(down)) {
			this.setTarget(down);
			this.defaultTimeout = WATER_FALL_TIMEOUT;
			return;
		} else {
			const ll = this.grid.getNeighborLowerLeft(this.position);
			if (!this.level.isGround(ll)) {
				this.setTarget(ll);
				this.defaultTimeout = WATER_FALL_TIMEOUT;
				return;
			} else {
				const lr = this.grid.getNeighborLowerRight(this.position);
				if (!this.level.isGround(lr)) {
					this.setTarget(lr);
					this.defaultTimeout = WATER_FALL_TIMEOUT;
					return;
				} else {
					this.defaultTimeout = WATER_TIMEOUT;
				}
			}
		}

		const visitors = this.chessboard.getTile(this.position).filter((v) => v !== this.model);

		const waterNodes = visitors.filter((v) => v._is_sprite && v.strategy.get() === STRATEGY_WATER);
		waterNodes.forEach(
			(w) => {
				if (this.model.data.amount > w.data.amount) {
					this.absorb(w);
				}
			}
		);

		const plantNodes = visitors.filter((v) => v._is_plant === true);
		const plantNode = plantNodes.length === 1 || this.lastPlantNode === null ? plantNodes[0] : visitors.find((v) => v !== this.lastPlantNode);

		if (plantNode) {

			if (this.model.data.inside) {

				if (plantNode.isRoot()) {
					this.model.data.insideUp = false;
				}
				if ((!this.model.data.insideUp) && (!plantNode.hasChildren())) {
					this.model.data.insideUp = true;
				}
				if (this.model.data.insideUp) {
					this.setTarget(plantNode.parent.position);
					this.lastPlantNode = plantNode.parent;
				} else {
					const children = Array.from(plantNode.children);
					children.sort((a, b) => b.power - a.power);
					const index = Math.floor(Math.pow(Math.random(), 2) * children.length);
					if (this.model.data.amount > (children[index].power * WATER_UNIT_SIZE)) {
						const spawn = this.spawn();
						spawn.image.position.set(children[index].position);
					} else {
						this.setTarget(children[index].position);
						this.lastPlantNode = children[index];
					}
				}
			} else {
				const capacity = plantNode.power / WATER_UNIT_SIZE;
				if (capacity > 1) {
					if (this.model.data.amount > WATER_UNIT_SIZE) {
						if (Math.random() < 0.5) {
							this.spawn();
						} else {
							this.timeout = WATER_TIMEOUT * (1 + Math.random());
						}
					} else {
						this.model.data.inside = true;
						this.timeout = 0;
						this.model.makeDirty();
					}
				}
			}
			return;
		}

	}

	updateInternal(delta) {
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI))
		this.model.image.scale.set(scale * 2);
	}

}
