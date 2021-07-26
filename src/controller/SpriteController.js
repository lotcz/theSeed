import ControllerBase from "./ControllerBase";
import BugStrategy from "../strategy/BugStrategy";
import ButterflyStrategy from "../strategy/ButterflyStrategy";
import TurnerStrategy from "../strategy/TurnerStrategy";
import WormStrategy from "../strategy/WormStrategy";
import WaterStrategy from "../strategy/WaterStrategy";

export const STRATEGY_BUG = 0;
export const STRATEGY_BUTTERFLY = 1;
export const STRATEGY_WORM = 2;
export const STRATEGY_WATER = 3;
export const STRATEGY_TURNER = 99;

export default class SpriteController extends ControllerBase {
	strategy;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.strategy = this.createStrategy(model);
		this.addChild(this.strategy);
	}

	createStrategy(model) {
		switch (model.strategy.get()) {
			case STRATEGY_BUG:
				return new BugStrategy(this.game, model, this.controls);
			case STRATEGY_BUTTERFLY:
				return new ButterflyStrategy(this.game, model, this.controls);
			case STRATEGY_TURNER:
				return new TurnerStrategy(this.game, model, this.controls);
			case STRATEGY_WORM:
				return new WormStrategy(this.game, model, this.controls);
			case STRATEGY_WATER:
				return new WaterStrategy(this.game, model, this.controls);
		}
	}


}
