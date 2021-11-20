import ControllerBase from "../class/ControllerBase";
import BugStrategy from "../strategy/sprites/animals/BugStrategy";
import ButterflyStrategy from "../strategy/sprites/animals/ButterflyStrategy";
import StaticStrategy from "../strategy/sprites/StaticStrategy";
import WaterStrategy from "../strategy/sprites/minerals/WaterStrategy";
import MineralStrategy from "../strategy/sprites/minerals/MineralStrategy";
import ExitStrategy from "../strategy/sprites/special/ExitStrategy";
import EmitterStrategy from "../strategy/sprites/special/EmitterStrategy";
import {
	STRATEGY_BUBBLE,
	STRATEGY_BUG,
	STRATEGY_BUTTERFLY,
	STRATEGY_DOOR_SLOT,
	STRATEGY_EMITTER, STRATEGY_EMPTY,
	STRATEGY_EXIT,
	STRATEGY_HINT,
	STRATEGY_JELLY_MAKER,
	STRATEGY_MINERAL, STRATEGY_OBJECT, STRATEGY_QUEEN,
	STRATEGY_STATIC,
	STRATEGY_TURNER,
	STRATEGY_WATER,
	STRATEGY_WORM
} from "../builder/SpriteStyle";
import BubbleStrategy from "../strategy/sprites/minerals/BubbleStrategy";
import JellymakerStrategy from "../strategy/sprites/animals/JellymakerStrategy";
import HintStrategy from "../strategy/sprites/special/HintStrategy";
import DoorSlotStrategy from "../strategy/sprites/special/DoorSlotStrategy";
import EmptyStrategy from "../strategy/sprites/EmptyStrategy";
import ObjectStrategy from "../strategy/sprites/ObjectStrategy";
import BeeQueenStrategy from "../strategy/sprites/animals/BeeQueenStrategy";

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
			case STRATEGY_EMPTY:
				return new EmptyStrategy(this.game, model, this.controls);
			case STRATEGY_STATIC:
				return new StaticStrategy(this.game, model, this.controls);
			case STRATEGY_OBJECT:
				return new ObjectStrategy(this.game, model, this.controls);
			case STRATEGY_BUG:
				return new BugStrategy(this.game, model, this.controls);
			case STRATEGY_BUTTERFLY:
				return new ButterflyStrategy(this.game, model, this.controls);
			case STRATEGY_TURNER:
				return new StaticStrategy(this.game, model, this.controls);
			case STRATEGY_WATER:
				return new WaterStrategy(this.game, model, this.controls);
			case STRATEGY_BUBBLE:
				return new BubbleStrategy(this.game, model, this.controls);
			case STRATEGY_MINERAL:
				return new MineralStrategy(this.game, model, this.controls);
			case STRATEGY_EXIT:
				return new ExitStrategy(this.game, model, this.controls);
			case STRATEGY_EMITTER:
				return new EmitterStrategy(this.game, model, this.controls);
			case STRATEGY_JELLY_MAKER:
				return new JellymakerStrategy(this.game, model, this.controls);
			case STRATEGY_QUEEN:
				return new BeeQueenStrategy(this.game, model, this.controls);
			case STRATEGY_HINT:
				return new HintStrategy(this.game, model, this.controls);
			case STRATEGY_DOOR_SLOT:
				return new DoorSlotStrategy(this.game, model, this.controls);
			default:
				console.error('Strategy not found:', id);
		}
	}

	onClick(e) {
		this.strategy.onClick(e);
	}

}
