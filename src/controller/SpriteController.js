import ControllerBase from "../class/ControllerBase";
import BugStrategy from "../strategy/sprites/animals/BugStrategy";
import ButterflyStrategy from "../strategy/sprites/animals/ButterflyStrategy";
import StaticStrategy from "../strategy/sprites/StaticStrategy";
import WaterStrategy from "../strategy/sprites/minerals/WaterStrategy";
import MineralStrategy from "../strategy/sprites/minerals/MineralStrategy";
import ExitStrategy from "../strategy/sprites/special/ExitStrategy";
import EmitterStrategy from "../strategy/sprites/special/EmitterStrategy";
import BubbleStrategy from "../strategy/sprites/minerals/BubbleStrategy";
import JellyMakerStrategy from "../strategy/sprites/animals/JellyMakerStrategy";
import HintStrategy from "../strategy/sprites/special/HintStrategy";
import DoorSlotStrategy from "../strategy/sprites/special/DoorSlotStrategy";
import EmptyStrategy from "../strategy/sprites/EmptyStrategy";
import ObjectStrategy from "../strategy/sprites/ObjectStrategy";
import BeeQueenStrategy from "../strategy/sprites/animals/BeeQueenStrategy";
import {
	STRATEGY_EMITTER,
	STRATEGY_EMPTY,
	STRATEGY_JELLY_MAKER,
	STRATEGY_OBJECT,
	STRATEGY_STATIC
} from "../builder/sprites/SpriteStyleBasic";
import {STRATEGY_BUG, STRATEGY_BUTTERFLY} from "../builder/sprites/SpriteStyleAnimals";
import {STRATEGY_BUBBLE, STRATEGY_MINERAL, STRATEGY_WATER} from "../builder/sprites/SpriteStyleMinerals";
import {STRATEGY_DOOR_SLOT, STRATEGY_EXIT} from "../builder/sprites/SpriteStyleSpecial";
import {STRATEGY_QUEEN} from "../builder/sprites/SpriteStyleBees";
import {STRATEGY_HINT} from "../builder/sprites/SpriteStyleHints";

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
				return new JellyMakerStrategy(this.game, model, this.controls);
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
