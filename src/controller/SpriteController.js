import ControllerBase from "../class/ControllerBase";
import BugStrategy from "../strategy/BugStrategy";
import ButterflyStrategy from "../strategy/ButterflyStrategy";
import TurnerStrategy from "../strategy/TurnerStrategy";
import WormStrategy from "../strategy/WormStrategy";
import WaterStrategy from "../strategy/WaterStrategy";
import MineralStrategy from "../strategy/MineralStrategy";
import RespawnStrategy from "../strategy/RespawnStrategy";
import ExitStrategy from "../strategy/ExitStrategy";
import EmitterStrategy from "../strategy/EmitterStrategy";
import {
	STRATEGY_BUBBLE,
	STRATEGY_BUG,
	STRATEGY_BUTTERFLY, STRATEGY_EMITTER, STRATEGY_EXIT,
	STRATEGY_MINERAL, STRATEGY_RESPAWN,
	STRATEGY_TURNER,
	STRATEGY_WATER,
	STRATEGY_WORM
} from "../builder/SpriteStyle";
import BubbleStrategy from "../strategy/BubbleStrategy";

export default class SpriteController extends ControllerBase {
	strategy;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.strategy = this.createStrategy(model);
		if (this.strategy) {
			this.addChild(this.strategy);
		}

		model.onClick = (e) => this.onClick(e);
	}

	createStrategy(model) {
		const id = model.strategy.get();
		switch (id) {
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
			case STRATEGY_BUBBLE:
				return new BubbleStrategy(this.game, model, this.controls);
			case STRATEGY_MINERAL:
				return new MineralStrategy(this.game, model, this.controls);
			case STRATEGY_RESPAWN:
				return new RespawnStrategy(this.game, model, this.controls);
			case STRATEGY_EXIT:
				return new ExitStrategy(this.game, model, this.controls);
			case STRATEGY_EMITTER:
				return new EmitterStrategy(this.game, model, this.controls);
			default:
				console.error('Strategy not found:', id);
		}
	}

	onClick(e) {
		this.strategy.onClick(e);
	}

}
