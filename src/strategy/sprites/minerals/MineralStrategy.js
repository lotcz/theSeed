import MovementStrategy from "../MovementStrategy";
import {STRATEGY_MINERAL} from "../../../builder/SpriteStyle";
import Pixies from "../../../class/Pixies";

const MINERAL_TIMEOUT = 1000;
const MINERAL_FALL_TIMEOUT = 200;
export const MINERAL_MAX_AMOUNT = 3;

export default class MineralStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, MINERAL_TIMEOUT);

		if (!this.model.data.amount) {
			this.model.data.amount = this.model.image.scale.get();
		}

		this.timeout = 0;
	}

	updateStrategy() {
		const down = this.grid.getNeighborDown(this.model.position);
		if (!this.level.isValidPosition(down)) {
			console.log('Mineral over board.');
			this.level.sprites.remove(this.model);
			return;
		}

		if (this.level.isWater(this.model.position)) {
			const up = this.grid.getNeighborUp(this.model.position);
			this.defaultTimeout = MINERAL_TIMEOUT;
			this.setTargetPosition(up);
			return;
		}

		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = MINERAL_FALL_TIMEOUT;
			this.setTargetPosition(down);
			return;
		} else {
			const available = [];
			const ll = this.grid.getNeighborLowerLeft(this.model.position);
			if (this.level.isPenetrable(ll)) {
				available.push(ll);
			}
			const lr = this.grid.getNeighborLowerRight(this.model.position);
			if (this.level.isPenetrable(lr)) {
				available.push(lr);
			}
			if (available.length > 0) {
				this.defaultTimeout = MINERAL_FALL_TIMEOUT * 2;
				this.setTargetPosition(Pixies.randomElement(available));
			} else {
				this.defaultTimeout = MINERAL_TIMEOUT;
			}
		}

		const visitors = this.chessboard.getTile(this.model.position).filter((v) => v !== this.model && v._is_sprite === true && v.strategy.get() === STRATEGY_MINERAL);
		visitors.forEach((v) => this.absorb(v));
	}

	static getScale(amount) {
		const scale = Math.sqrt(amount / (4 * Math.PI));
		return (scale * 2);
	}

	updateInternal(delta) {
		this.setTargetScale(MineralStrategy.getScale(this.model.data.amount));
		super.updateInternal(delta);
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount && (node.data.amount + this.model.data.amount) <= MINERAL_MAX_AMOUNT) {
			console.log('Absorb');
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.level.sprites.remove(node);
		}
	}

}
