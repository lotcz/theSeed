import SpriteControllerStrategy from "./SpriteControllerStrategy";
import LevelBuilder from "../builder/LevelBuilder";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";
import {MINERAL_MAX_AMOUNT} from "./MineralStrategy";

const EMITTER_TIMEOUT = 1000;

export default class EmitterStrategy extends SpriteControllerStrategy {
	max;
	emitted;

	constructor(game, model, controls) {
		super(game, model, controls, EMITTER_TIMEOUT);

		this.movementEnabled = false;
		this.turningEnabled = false;
		this.scalingEnabled = false;
		this.max = -1;
		this.emitted = 0;

		this.builder = new LevelBuilder(this.level);

		if (this.model.data.timeout) {
			this.defaultTimeout = this.model.data.timeout;
		}

		if (this.model.data.max) {
			this.max = this.model.data.max;
		}

	}

	selectTargetInternal() {
		if (this.max === -1 || this.emitted < this.max) {
			const visitors = this.chessboard.getVisitors(this.position, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_MINERAL) && v.type === this.model.data.type);
			const totalAmount = visitors.reduce((previous, current) => previous + current.data.amount, 0);
			if (totalAmount < MINERAL_MAX_AMOUNT) {
				this.emitted++;
				const sprite = this.builder.addSpriteFromStyle(this.position, this.model.data.type);
				if (this.model.data.amount) {
					sprite.data.amount = this.model.data.amount;
				}
			}
		}
	}

}
