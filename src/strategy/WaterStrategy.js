import SpriteControllerStrategy from "./SpriteControllerStrategy";
import LevelBuilder from "../builder/LevelBuilder";
import {IMAGE_WATER, STRATEGY_MINERAL, STRATEGY_WATER} from "../builder/SpriteStyle";
import Pixies from "../class/Pixies";

const DEBUG_WATER = false;

const WATER_TIMEOUT = 700;
const WATER_FALL_TIMEOUT = 250;
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

	selectTargetInternal() {
		const down = this.grid.getNeighborDown(this.position);
		if (!this.level.isValidPosition(down)) {
			this.remove();
			return;
		}

		if (this.level.isWater(this.position)) {
			this.model.data.amount -= WATER_UNIT_SIZE;
			if (this.model.data.amount <= 0) {
				this.level.sprites.remove(this.model);
				return;
			}
			const up = this.grid.getNeighborUp(this.position);
			this.setTarget(up);
			this.defaultTimeout = WATER_TIMEOUT;
			return;
		}

		if (this.level.isPenetrable(down)) {
			this.setTarget(down);
			this.defaultTimeout = WATER_FALL_TIMEOUT;
			return;
		} else {
			const available = [];
			const ll = this.grid.getNeighborLowerLeft(this.position);
			if (!this.level.isValidPosition(ll)) {
				this.remove();
				return;
			}
			if (this.level.isAir(ll)) {
				available.push(ll);
			}
			const lr = this.grid.getNeighborLowerRight(this.position);
			if (!this.level.isValidPosition(lr)) {
				this.remove();
				return;
			}
			if (this.level.isAir(lr)) {
				available.push(lr);
			}
			if (available.length > 0) {
				const next = Pixies.randomElement(available);
				this.setTarget(next);
				this.defaultTimeout = WATER_FALL_TIMEOUT * 2;
			} else {
				this.defaultTimeout = WATER_TIMEOUT;
			}
		}

		const visitors = this.chessboard.getTile(this.position).filter((v) => v !== this.model && v._is_sprite === true && v.strategy.get() === STRATEGY_WATER);
		visitors.forEach((v) => this.absorb(v));
	}

	updateInternal(delta) {
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI))
		if (scale > 0) {
			this.targetScale = scale * 2;
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

	remove() {
		if (DEBUG_WATER) console.log('Water over board.');
		this.level.sprites.remove(this.model);
	}
}
