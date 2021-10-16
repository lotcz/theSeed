import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import SpriteBuilder, {IMAGE_WATER, IMAGE_WORM_BODY, IMAGE_WORM_BUTT} from "../builder/SpriteBuilder";
import {STRATEGY_MINERAL, STRATEGY_WATER, STRATEGY_WORM} from "../controller/SpriteController";

const MINERAL_UNIT_SIZE = 0.1;
const MINERAL_TIMEOUT = 1000;
const MINERAL_FALL_TIMEOUT = 200;

export default class MineralStrategy extends SpriteControllerStrategy {
	insideUp;


	constructor(game, model, controls) {
		super(game, model, controls, MINERAL_TIMEOUT);

		if (!this.model.data.amount) {
			this.model.data.amount = this.model.image.scale.get();
		}

		this.timeout = 0;
	}

	selectTargetInternal() {
		if (!this.level.isValidPosition(this.position)) {
			console.log('Mineral over board.');
			this.level.sprites.remove(this.model);
			return;
		}

		const down = this.grid.getNeighborDown(this.position);
		if (this.level.isPenetrable(down)) {
			this.setTarget(down);
			this.defaultTimeout = MINERAL_FALL_TIMEOUT;
			return;
		} else {
			const ll = this.grid.getNeighborLowerLeft(this.position);
			if (this.level.isPenetrable(ll)) {
				this.setTarget(ll);
				this.defaultTimeout = MINERAL_FALL_TIMEOUT * 2;
				return;
			} else {
				const lr = this.grid.getNeighborLowerRight(this.position);
				if (this.level.isPenetrable(lr)) {
					this.setTarget(lr);
					this.defaultTimeout = MINERAL_FALL_TIMEOUT * 2;
					return;
				} else {
					this.defaultTimeout = MINERAL_TIMEOUT;
				}
			}
		}

		const visitors = this.chessboard.getTile(this.position).filter((v) => v !== this.model && v._is_sprite === true && v.strategy.get() === STRATEGY_MINERAL);
		visitors.forEach(
			(v) => {
				if (this.model.data.amount >= v.data.amount) {
					this.absorb(v);
				}
			}
		);

	}

	updateInternal(delta) {
		if (this.scalingEnabled) {
			const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI));
			this.targetScale = (scale * 2);
		}
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount) {
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.level.sprites.remove(node);
			this.chessboard.removeVisitor(this.position, node);
		}
	}

	findEmptyNeighbor() {
		const neighbors = this.grid.getNeighbors(this.position);
		const empty = neighbors.filter((n) => this.chessboard.getTile(n).length === 0);
		return Pixies.randomElement(empty);
	}

	spawn() {
		const position = this.findEmptyNeighbor();
		if (!position) return;

		const spriteBuilder = new SpriteBuilder(this.level);
		const spawn = spriteBuilder.addSprite(position, this.model.image.scale.get(), this.model.image.flipped.get(), this.model.image.rotation.get(), this.model.image.path, this.model.strategy.get(), this.model.data);
		//this.model.data.amount -= WATER_UNIT_SIZE;
		this.model.makeDirty();
		return spawn;
	}

	onClick(e) {
		this.spawn();
	}

}
