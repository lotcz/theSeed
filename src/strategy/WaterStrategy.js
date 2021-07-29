import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import SpriteBuilder, {IMAGE_WATER, IMAGE_WORM_BODY, IMAGE_WORM_BUTT} from "../builder/SpriteBuilder";
import {STRATEGY_WATER, STRATEGY_WORM} from "../controller/SpriteController";

const WATER_TIMEOUT = 3000;
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

	spawn() {
		const spriteBuilder = new SpriteBuilder(this.game.level);
		this.lastSpawn = spriteBuilder.addSprite(this.position, WATER_UNIT_SIZE, false, this.model.image.rotation.get(), IMAGE_WATER, STRATEGY_WATER, {amount:WATER_UNIT_SIZE, inside: true, insideUp:this.model.data.insideUp });
		this.model.data.amount -= WATER_UNIT_SIZE;
		this.model.makeDirty();
		return this.lastSpawn;
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount && node !== this.lastSpawn) {
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.game.level.sprites.remove(node);
			this.game.level.grid.chessboard.removeVisitor(this.position, node);
		}
	}

	selectTargetInternal() {
		const visitors = this.game.level.grid.chessboard.getTile(this.position).filter((v) => v !== this.model);
		const plantNodes = visitors.filter((v) => v._is_plant === true);
		const plantNode = plantNodes.length === 1 || this.lastPlantNode === null ? plantNodes[0] : visitors.find((v) => v !== this.lastPlantNode);

		if (plantNode) {

			if (this.model.data.inside) {

				const waterNodes = visitors.filter((v) => v._is_sprite && v.strategy.get() === STRATEGY_WATER);
				waterNodes.forEach(
					(w) => {
						if ((this.model.data.amount + w.data.amount) <= (plantNode.power * WATER_UNIT_SIZE)) {
							this.absorb(w);
						}
					}
				);

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
					if (this.model.data.amount > (children[index].position.power * WATER_UNIT_SIZE)) {
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

		if (Math.random() < 0.9) return;

		const down = this.game.level.grid.getNeighborDown(this.position);
		if (!this.game.level.isValidPosition(down)) {
			this.game.level.sprites.remove(this.model);
		}
		this.setTarget(down);

	}

	updateInternal(delta) {
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI))
		this.model.image.scale.set(scale * 2);
	}

}
