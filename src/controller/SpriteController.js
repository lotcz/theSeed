import ControllerBase from "./ControllerBase";
import BugStrategy from "./BugStrategy";
import ButterflyStrategy from "./ButterflyStrategy";
import TurnerStrategy from "./TurnerStrategy";

export const STRATEGY_BUG = 0;
export const STRATEGY_BUTTERFLY = 1;
export const STRATEGY_TURNER = 2;

export default class SpriteController extends ControllerBase {
	strategy;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.strategy = this.createStrategy(model);
	}

	createStrategy(model) {
		switch (model.strategy.get()) {
			case STRATEGY_BUG:
				return new BugStrategy(this.game, model, this.controls);
			case STRATEGY_BUTTERFLY:
				return new ButterflyStrategy(this.game, model, this.controls);
			case STRATEGY_TURNER:
				return new TurnerStrategy(this.game, model, this.controls);
		}
	}

	update(delta) {
		this.strategy.update(delta);
	}

}
