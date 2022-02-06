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
	STRATEGY_DOOR_MOUTH,
	STRATEGY_DOOR_MOUTH_TRIGGER,
	STRATEGY_EMITTER,
	STRATEGY_EMPTY, STRATEGY_FRIEND,
	STRATEGY_JELLY_MAKER, STRATEGY_LARVA,
	STRATEGY_OBJECT,
	STRATEGY_STATIC
} from "../builder/sprites/SpriteStyleBasic";
import {
	STRATEGY_ANT,
	STRATEGY_BUG,
	STRATEGY_BUTTERFLY,
	STRATEGY_TOAD
} from "../builder/sprites/SpriteStyleAnimals";
import {STRATEGY_BUBBLE, STRATEGY_MINERAL, STRATEGY_WATER} from "../builder/sprites/SpriteStyleMinerals";
import {
	STRATEGY_DOOR_SLOT,
	STRATEGY_EXIT,
	STRATEGY_SWITCH
} from "../builder/sprites/SpriteStyleSpecial";
import {STRATEGY_QUEEN} from "../builder/sprites/SpriteStyleBees";
import {STRATEGY_HINT} from "../builder/sprites/SpriteStyleHints";
import LarvaStrategy from "../strategy/sprites/animals/LarvaStrategy";
import AntStrategy from "../strategy/sprites/animals/AntStrategy";
import ToadStrategy from "../strategy/sprites/animals/ToadStrategy";
import FriendStrategy from "../strategy/sprites/animals/FriendStrategy";
import SwitchStrategy from "../strategy/sprites/special/SwitchStrategy";
import MouthTriggerStrategy from "../strategy/sprites/special/MouthTriggerStrategy";
import DoorMouthStrategy from "../strategy/sprites/special/DoorMouthStrategy";

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
			case STRATEGY_LARVA:
			case 'bee-larva':
				return new LarvaStrategy(this.game, model, this.controls);
			case STRATEGY_ANT:
				return new AntStrategy(this.game, model, this.controls);
			case STRATEGY_BUTTERFLY:
				return new ButterflyStrategy(this.game, model, this.controls);
			case STRATEGY_TOAD:
				return new ToadStrategy(this.game, model, this.controls);
			case STRATEGY_DOOR_MOUTH_TRIGGER:
			case 'carnivorous-plant':
				return new MouthTriggerStrategy(this.game, model, this.controls);
			case STRATEGY_DOOR_MOUTH:
				return new DoorMouthStrategy(this.game, model, this.controls);
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
			case STRATEGY_FRIEND:
				return new FriendStrategy(this.game, model, this.controls);
			case STRATEGY_JELLY_MAKER:
				return new JellyMakerStrategy(this.game, model, this.controls);
			case STRATEGY_QUEEN:
				return new BeeQueenStrategy(this.game, model, this.controls);
			case STRATEGY_HINT:
				return new HintStrategy(this.game, model, this.controls);
			case STRATEGY_DOOR_SLOT:
				return new DoorSlotStrategy(this.game, model, this.controls);
			case STRATEGY_SWITCH:
				return new SwitchStrategy(this.game, model, this.controls);
			default:
				console.error('Strategy not found:', id);
		}
	}

	onClick(e) {
		this.strategy.onClick(e);
	}

}
