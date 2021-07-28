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

		this.lastPlantNode = null;
		this.insideUp = true;
	}

	spawn() {
		const spriteBuilder = new SpriteBuilder(this.game.level);
		const spawn = spriteBuilder.addSprite(this.position, WATER_UNIT_SIZE, false, this.model.image.rotation.get(), IMAGE_WATER, STRATEGY_WATER, {amount:WATER_UNIT_SIZE, inside: true});
		this.model.data.amount -= WATER_UNIT_SIZE;
		this.model.makeDirty();
	}

	selectTargetInternal() {
		const visitors = this.game.level.grid.chessboard.getTile(this.position);
		const plantNodes = visitors.filter((v) => v._is_plant === true);
		const plantNode = plantNodes.length === 1 || this.lastPlantNode === null ? plantNodes[0] : visitors.find((v) => v !== this.lastPlantNode);

		if (plantNode) {
			if (this.model.data.inside) {
				if (plantNode.isRoot()) {
					this.insideUp = false;
				}
				if ((!this.insideUp) && (!plantNode.hasChildren())) {
					this.insideUp = true;
				}
				if (this.insideUp) {
					this.setTarget(plantNode.parent.position);
					this.lastPlantNode = plantNode.parent;
				} else {
					const children = Array.from(plantNode.children);
					children.sort((a, b) => b.power - a.power);
					const index = Math.floor(Math.pow(Math.random(), 2) * children.length);
					this.setTarget(children[index].position);
					this.lastPlantNode = children[index];
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
		this.model.image.scale.set(this.model.data.amount);
	}

}
