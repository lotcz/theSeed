import MovementStrategy from "../MovementStrategy";
import {STRATEGY_WATER} from "../../../builder/SpriteStyle";
import Pixies from "../../../class/Pixies";
import MineralStrategy from "./MineralStrategy";

const DEBUG_WATER = false;

const WATER_TIMEOUT = 700;
const WATER_FALL_TIMEOUT = 250;
export const WATER_UNIT_SIZE = 0.1;

export default class WaterStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, WATER_TIMEOUT);

		if (!this.model.data.amount) {
			this.model.data.amount = this.model.image.scale.get();
		}

		this.timeout = 0;
	}

	updateStrategy() {
		const down = this.grid.getNeighborDown(this.model.position);
		if (!this.level.isValidPosition(down)) {
			this.remove();
			return;
		}

		if (this.level.isWater(this.model.position)) {
			this.model.data.amount -= WATER_UNIT_SIZE;
			if (this.model.data.amount <= 0) {
				this.level.sprites.remove(this.model);
				return;
			}
			this.defaultTimeout = WATER_TIMEOUT;
			const up = this.grid.getNeighborUp(this.model.position);
			this.setTargetPosition(up);
			return;
		}

		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = WATER_FALL_TIMEOUT;
			this.setTargetPosition(down);
			return;
		} else {
			const available = [];
			const ll = this.grid.getNeighborLowerLeft(this.model.position);
			if (!this.level.isValidPosition(ll)) {
				this.remove();
				return;
			}
			if (this.level.isAir(ll)) {
				available.push(ll);
			}
			const lr = this.grid.getNeighborLowerRight(this.model.position);
			if (!this.level.isValidPosition(lr)) {
				this.remove();
				return;
			}
			if (this.level.isAir(lr)) {
				available.push(lr);
			}
			if (available.length > 0) {
				this.defaultTimeout = WATER_FALL_TIMEOUT * 2;
				const next = Pixies.randomElement(available);
				this.setTargetPosition(next);
			} else {
				this.defaultTimeout = WATER_TIMEOUT;
			}
		}

		const visitors = this.chessboard.getTile(this.model.position).filter((v) => v !== this.model && v._is_sprite === true && v.strategy.get() === STRATEGY_WATER);
		visitors.forEach((v) => this.absorb(v));
	}

	updateInternal(delta) {
		this.setTargetScale(MineralStrategy.getScale(this.model.data.amount));
		super.updateInternal(delta);
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount) {
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.level.sprites.remove(node);
			this.chessboard.removeVisitor(this.model.position, node);
		}
	}

	remove() {
		if (DEBUG_WATER) console.log('Water over board.');
		this.level.sprites.remove(this.model);
	}
}
