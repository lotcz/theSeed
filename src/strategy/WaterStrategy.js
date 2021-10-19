import SpriteControllerStrategy from "./SpriteControllerStrategy";
import LevelBuilder from "../builder/LevelBuilder";
import {IMAGE_WATER, STRATEGY_WATER} from "../builder/SpriteStyle";

const WATER_TIMEOUT = 3000;
const WATER_FALL_TIMEOUT = 300;
export const WATER_UNIT_SIZE = 0.1;

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

		this.timeout = 0;
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount) {
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.level.sprites.remove(node);
			this.chessboard.removeVisitor(this.position, node);
		}
	}

	selectTargetInternal() {
		if (!this.level.isValidPosition(this.position)) {
			console.log('Water over board');
			this.level.sprites.remove(this.model);
			return;
		}
		const visitors = this.chessboard.getTile(this.position).filter((v) => v !== this.model);

		const waterNodes = visitors.filter((v) => v._is_sprite && v.strategy.get() === STRATEGY_WATER);
		waterNodes.forEach(
			(w) => {
				if (this.model.data.amount >= w.data.amount) {
					this.absorb(w);
				}
			}
		);

		if (this.level.isWater(this.position)) {
			this.level.sprites.remove(this.model);
			return;
		}

		const down = this.grid.getNeighborDown(this.position);
		if (this.level.isPenetrable(down) || this.level.isWater(down)) {
			this.setTarget(down);
			this.defaultTimeout = WATER_FALL_TIMEOUT;
			return;
		}

		const ll = this.grid.getNeighborLowerLeft(this.position);
		if (this.level.isPenetrable(ll) || this.level.isWater(ll)) {
			this.setTarget(ll);
			this.defaultTimeout = WATER_FALL_TIMEOUT * 2;
			return;
		}

		const lr = this.grid.getNeighborLowerRight(this.position);
		if (this.level.isPenetrable(lr) || this.level.isWater(lr)) {
			this.setTarget(lr);
			this.defaultTimeout = WATER_FALL_TIMEOUT * 2;
			return;
		}

		this.defaultTimeout = WATER_TIMEOUT;

	}

	updateInternal(delta) {
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI))
		if (scale > 0) {
			this.targetScale = scale * 2;
		}
	}

}
