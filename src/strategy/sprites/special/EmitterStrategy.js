import {STRATEGY_MINERAL} from "../../../builder/SpriteStyle";
import UpdatedStrategy from "../UpdatedStrategy";

const EMITTER_TIMEOUT = 1000;

export default class EmitterStrategy extends UpdatedStrategy {
	max;
	emitted;

	constructor(game, model, controls) {
		super(game, model, controls, EMITTER_TIMEOUT);

		this.max = -1;
		this.emitted = 0;
		this.randomizeTimeout = true;

		if (this.model.data.timeout) {
			this.defaultTimeout = this.model.data.timeout;
		}

		if (this.model.data.max !== undefined) {
			this.max = this.model.data.max;
		}
	}

	updateStrategy() {
		if (this.max === -1 || this.emitted < this.max) {
			const visitors = this.chessboard.getVisitors(this.model.position, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_MINERAL) && v.type === this.model.data.type);
			if (visitors.length === 0) {
				this.emitted++;
				const sprite = this.level.addSpriteFromStyle(this.model.position, this.model.data.type);
				if (this.model.data.amount) {
					sprite.data.amount = this.model.data.amount;
				}
			}
		}
	}

}
