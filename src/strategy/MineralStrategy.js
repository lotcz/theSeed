import SpriteControllerStrategy from "./SpriteControllerStrategy";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";
import Pixies from "../class/Pixies";

const MINERAL_TIMEOUT = 1000;
const MINERAL_FALL_TIMEOUT = 200;
export const MINERAL_MAX_AMOUNT = 3;

export default class MineralStrategy extends SpriteControllerStrategy {

	constructor(game, model, controls) {
		super(game, model, controls, MINERAL_TIMEOUT);

		if (!this.model.data.amount) {
			this.model.data.amount = this.model.image.scale.get();
		}

		this.timeout = 0;
	}

	selectTargetInternal() {
		const down = this.grid.getNeighborDown(this.position);
		if (!this.level.isValidPosition(down)) {
			console.log('Mineral over board.');
			this.level.sprites.remove(this.model);
			return;
		}

		if (this.level.isWater(this.position)) {
			const up = this.grid.getNeighborUp(this.position);
			this.setTarget(up);
			this.defaultTimeout = MINERAL_TIMEOUT;
			return;
		}

		if (this.level.isPenetrable(down)) {
			this.setTarget(down);
			this.defaultTimeout = MINERAL_FALL_TIMEOUT;
			return;
		} else {
			const available = [];
			const ll = this.grid.getNeighborLowerLeft(this.position);
			if (this.level.isPenetrable(ll)) {
				available.push(ll);
			}
			const lr = this.grid.getNeighborLowerRight(this.position);
			if (this.level.isPenetrable(lr)) {
				available.push(lr);
			}
			if (available.length > 0) {
				this.setTarget(Pixies.randomElement(available));
				this.defaultTimeout = MINERAL_FALL_TIMEOUT * 2;
			} else {
				this.defaultTimeout = MINERAL_TIMEOUT;
			}
		}

		const visitors = this.chessboard.getTile(this.position).filter((v) => v !== this.model && v._is_sprite === true && v.strategy.get() === STRATEGY_MINERAL);
		visitors.forEach((v) => this.absorb(v));
	}

	static getScale(amount) {
		const scale = Math.sqrt(amount / (4 * Math.PI));
		return (scale * 2);
	}

	updateInternal(delta) {
		this.targetScale = MineralStrategy.getScale(this.model.data.amount);
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount && (node.data.amount + this.model.data.amount) <= MINERAL_MAX_AMOUNT) {
			console.log('Absorb');
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.level.sprites.remove(node);
			this.chessboard.removeVisitor(this.position, node);
		}
	}

}
