import SpriteControllerStrategy from "./SpriteControllerStrategy";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";

const MINERAL_TIMEOUT = 1000;
const MINERAL_FALL_TIMEOUT = 200;

export default class MineralStrategy extends SpriteControllerStrategy {

	constructor(game, model, controls) {
		super(game, model, controls, MINERAL_TIMEOUT);

		console.log('creating strategy', this.model.is_deleted);

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
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI));
		this.targetScale = (scale * 2);
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount) {
			this.model.data.amount += node.data.amount;
			this.model.makeDirty();
			this.level.sprites.remove(node);
			this.chessboard.removeVisitor(this.position, node);
		}
	}

}
