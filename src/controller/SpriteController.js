import ControllerBase from "./ControllerBase";
import BugStrategy from "./BugStrategy";
import {STRATEGY_BUG} from "../model/SpriteModel";

export default class SpriteController extends ControllerBase {
	strategy;

	constructor(grid, model, controls) {
		super(grid, model, controls);

		this.strategy = this.createStrategy(model);
	}

	createStrategy(model) {
		switch (model.strategy.get()) {
			case STRATEGY_BUG:
				return new BugStrategy(this.grid, model, this.controls);
		}
	}

	update(delta) {
		this.strategy.update(delta);
	}

}
