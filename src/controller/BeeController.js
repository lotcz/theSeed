import ControllerBase from "../class/ControllerBase";
import {SPRITE_STYLES} from "../builder/SpriteStyle";
import Vector2 from "../class/Vector2";
import BeeFlightStrategy from "../strategy/bee/BeeFlightStrategy";
import BeeCrawlStrategy from "../strategy/bee/BeeCrawlStrategy";
import AnimationController from "./AnimationController";
import BeeDeathStrategy from "../strategy/bee/BeeDeathStrategy";
import {NEIGHBOR_TYPE_DOWN, NEIGHBOR_TYPE_UPPER_RIGHT} from "../model/GridModel";
import OuchSound1 from "../../res/sound/ouch-1.mp3";
import OuchSound2 from "../../res/sound/ouch-2.mp3";
import DropSound from "../../res/sound/pop-2.mp3";
import SplashSound from "../../res/sound/splash.mp3";
import Sound from "../class/Sound";
import SpriteCollectionController from "./SpriteCollectionController";
import HintModel from "../model/HintModel";
import HintController from "./HintController";
import ObjectStrategy, {DEFAULT_OBJECT_MAX_AMOUNT} from "../strategy/sprites/ObjectStrategy";
import Pixies from "../class/Pixies";
import DoorSlotStrategy from "../strategy/sprites/special/DoorSlotStrategy";
import {GROUND_TYPE_WAX_BACKGROUND, GROUND_TYPE_WAX_DOOR} from "../builder/GroundStyle";
import {MAX_HEALTH} from "../model/BeeStateModel";
import {SPRITE_TYPE_BEE_LIFE} from "../builder/sprites/SpriteStyleObjects";
import {IMAGE_HINT_ACTION, IMAGE_HINT_ARROWS, IMAGE_HINT_WASD} from "../builder/sprites/SpriteStyleHints";
import {STRATEGY_DOOR_SLOT} from "../builder/sprites/SpriteStyleSpecial";
import {STRATEGY_MINERAL} from "../builder/sprites/SpriteStyleMinerals";
import {STRATEGY_OBJECT} from "../builder/sprites/SpriteStyleBasic";
import WaterStrategy from "../strategy/sprites/minerals/WaterStrategy";

export const BEE_CENTER = new Vector2(1000, 1000);
const HEALING_SPEED = 0.01; // health per second
const MAX_INVENTORY_AMOUNT = DEFAULT_OBJECT_MAX_AMOUNT;
const DROP_ITEM_TIMEOUT = 1000;
const STARS_TIMEOUT = 3000;

export default class BeeController extends ControllerBase {
	static ouchSounds = [new Sound(OuchSound1), new Sound(OuchSound2)];
	static dropSound = new Sound(DropSound);
	static splashSound = new Sound(SplashSound);

	dead;
	leaving;
	dropItemTimeout;
	showingControlsHint;
	showingActionHint;
	showingDoorsHint;
	starsTimeout;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.dead = false;
		this.leaving = null;
		this.dropItemTimeout = 0;
		this.starsTimeout = 0;
		this.showingControlsHint = false;
		this.showingActionHint = false;
		this.showingDoorsHint = false;

		this.crawlingAnimationController = new AnimationController(this.game, this.model.crawlingAnimation, this.controls);
		this.addChild(this.crawlingAnimationController);

		this.starsAnimationController = new AnimationController(this.game, this.model.starsAnimation, this.controls);
		this.addChild(this.starsAnimationController);

		this.spritesController = new SpriteCollectionController(this.game, this.model.sprites, this.controls);
		this.addChild(this.spritesController);

		this.model.coordinates.set(this.grid.getCoordinates(this.model.position));
		if (this.model.crawling.get()) {
			this.crawl(this.model.crawling.get())
		} else {
			this.fly();
		}

		this.onTravelHandler = () => this.leave();
		this.onHurtHandler = (amount) => this.onHurt(amount);
	}

	activateInternal() {
		this.model.scale.set(1);
		if (this.model.inventory.isSet()) {
			this.level.addResource(this.model.inventory.get().image.path.get());
		}
		this.updateMovement();

		if (!(this.showingControlsHint || this.game.historyExists('hint-controls-displayed'))) {
			setTimeout(() => this.showControlsHint(), 2000);
		}

		this.model.addOnTravelListener(this.onTravelHandler);
		this.game.beeState.addOnHurtListener(this.onHurtHandler);
	}

	deactivateInternal() {
		this.model.removeOnTravelListener(this.onTravelHandler);
		this.game.beeState.removeOnHurtListener(this.onHurtHandler);
	}

	updateInternal(delta) {
		if (this.dead || this.leaving) {
			return;
		}

		const secsDelta = delta / 1000;

		if (this.level.isCloud(this.model.position)) {
			this.game.beeState.hurt(secsDelta);
		}

		if (this.game.beeState.isDead()) {
			this.die();
			return;
		}

		if (this.level.isWater(this.model.position)) {
			WaterStrategy.splashSound.replay();
			this.die();
			return;
		}

		/*
		if (this.game.beeState.isHurt()) {
			this.game.beeState.heal(HEALING_SPEED * secsDelta);
		}
		*/

		if (this.starsTimeout <= 0) {
			if (this.starsAnimationController.isActivated()) {
				this.starsAnimationController.deactivate();
			}
			if (this.model.starsVisible.get()) {
				this.model.starsVisible.set(false);
			}
		} else {
			this.starsTimeout -= delta;
		}

		if (this.dropItemTimeout > 0) {
			this.dropItemTimeout -= delta;
		} else {
			this.inspectForMinerals(this.model.position, delta);
		}

		if (this.controls.interacting.get()) {
			if (this.showingActionHint) {
				this.hideHint();
				this.game.setHistory('hint-action-displayed');
				this.showingActionHint = false;
			}
			this.dropItem();
		}

		if (this.showingControlsHint && this.controls.anyMovement()) {
			this.hideHint();
			this.game.setHistory('hint-controls-displayed');
			this.showingControlsHint = false;
		}
	}

	fly() {
		this.model.crawling.set(null);
		this.crawlingAnimationController.deactivate();
		this.setStrategy(new BeeFlightStrategy(this.game, this.model, this.controls));
		this.updateInventory();
	}

	crawl(direction) {
		this.model.crawling.set(direction);
		this.crawlingAnimationController.activate();
		this.setStrategy(new BeeCrawlStrategy(this.game, this.model, this.controls));
		this.updateInventory();
	}

	die() {
		this.crawlingAnimationController.deactivate();
		this.starsAnimationController.deactivate();
		this.dead = true;
		this.setStrategy(new BeeDeathStrategy(this.game, this.model, this.controls));
	}

	leave() {
		if (this.hintController && this.hintController.isInitialized()) {
			this.hintController.destroy();
		}
		if (!this.leaving) {
			this.leaving = true;
			if (!this.model.isFlying()) {
				this.fly();
			}
			this.strategy.leave();
		}
	}

	updateInventory() {
		if (!this.model.inventory.isEmpty()) {
			if (this.model.isFlying()) {
				this.model.inventory.get().image.coordinates.set(BEE_CENTER.addY(80));
			} else {
				this.model.inventory.get().image.coordinates.set(BEE_CENTER);
			}
			this.model.inventory.get().image.scale.set(ObjectStrategy.getObjectScale(this.model.inventory.get().data.amount, MAX_INVENTORY_AMOUNT));
		}
	}

	setStrategy(strategy) {
		if (this.strategy) this.removeChild(this.strategy);
		this.strategy = strategy;
		this.addChild(this.strategy);
		this.strategy.activate();
		this.model.triggerOnStrategyChangedEvent();
	}

	inspectForMinerals(position, delta) {
		const visitors = this.chessboard.getVisitors(position);

		const lives = visitors.filter((v) => v._is_sprite && v.type === SPRITE_TYPE_BEE_LIFE);
		if (lives.length > 0) {
			DoorSlotStrategy.drJonesSound.play();
			lives.forEach((l) => {
				this.game.beeState.maxLives.set(this.game.beeState.maxLives.get() + 1);
				this.game.beeState.lives.set(this.game.beeState.lives.get() + 1);
				this.game.beeState.health.set(MAX_HEALTH);
				this.level.sprites.remove(l);
			});
		}

		if (this.game.beeState.isHurt()) {
			const wax = visitors.filter((v) => v._is_ground && v.type === GROUND_TYPE_WAX_BACKGROUND);
			if (wax.length > 0) {
				this.game.beeState.heal(10 * HEALING_SPEED * delta / 1000);
			}
		}

		const doors = visitors.filter((v) => v._is_sprite && (v.strategy.get() === STRATEGY_DOOR_SLOT));
		if (doors.length > 0) {
			const data = doors[0].data;
			const key = data && data.key;
			const style = SPRITE_STYLES[key];
			if (!style) {
				console.log('Door style not found!', key, doors[0]);
			} else if (!this.showingDoorsHint) {
				this.showingDoorsHint = true;
				this.showHint([style.image.uri], 2, data.hintDirection);
			}
		} else {
			if (this.showingDoorsHint) {
				this.hideHint();
				this.showingDoorsHint = false;
			}
		}

		if (this.carriedAmount() < MAX_INVENTORY_AMOUNT) {
			const minerals = visitors.filter((v) => v._is_sprite && (v.strategy.get() === STRATEGY_MINERAL || v.strategy.get() === STRATEGY_OBJECT));
			minerals.forEach((m) =>	this.takeItem(m));
		}
	}

	carriedAmount() {
		return this.model.inventory.isEmpty() ? 0 : this.model.inventory.get().data.amount;
	}

	takeItem(item) {
		if (!(this.showingActionHint || this.game.historyExists('hint-action-displayed'))) {
			setTimeout(() => this.showActionHint(), 1000);
		}

		if (this.dropItemTimeout > 0) {
			return;
		}
		const sameType = this.model.inventory.isEmpty() ? null : this.model.inventory.get().type === item.type ? this.model.inventory.get() : null;
		if (this.model.inventory.isSet() && !sameType) {
			return;
		}

		let amount = Pixies.between(1, MAX_INVENTORY_AMOUNT - this.carriedAmount(), item.data.amount);

		if (sameType) {
			sameType.data.amount += amount;
		} else {
			this.model.inventory.set(item.clone());
			item.data.amount = amount;
		}

		item.data.amount -= amount;
		if (item.data.amount <= 0) {
			this.level.sprites.remove(item);
		}

		this.updateInventory();
	}

	dropItem() {
		if (this.model.inventory.isEmpty()) {
			return;
		}
		if (this.showingActionHint) {
			this.hideHint();
			this.showingActionHint = false;
		}
		const item = this.model.inventory.get();
		this.model.inventory.set(null);
		const down = this.grid.getNeighbor(this.model.position, NEIGHBOR_TYPE_DOWN);
		const position = this.level.isPenetrable(down) ? down : this.model.position;
		this.level.addResource(item.image.path.get());
		item.position.set(position);
		this.level.sprites.add(item);
		this.dropItemTimeout = DROP_ITEM_TIMEOUT;
		BeeController.dropSound.play();
	}

	emptyInventory() {
		this.dropItem();
	}

	updateMovement() {
		this.level.centerOnCoordinates(this.model.coordinates);
		this.level.sanitizeViewBox();
	}

	onHurt(amount) {
		const sound = Pixies.randomElement(BeeController.ouchSounds);
		setTimeout(() => sound.play(), 250);
		if (amount > 0.3 || this.game.beeState.health.get() < 0.5) {
			this.dropItem();
		}
		if (!this.model.starsVisible.get()) {
			this.model.starsVisible.set(true);
		}
		if (!this.starsAnimationController.isActivated()) {
			this.model.starsAnimation.image.coordinates.set(BEE_CENTER);
			this.starsAnimationController.activate();
		}
		this.starsTimeout = STARS_TIMEOUT;
	}

	showControlsHint() {
		if (!this.showingControlsHint) {
			this.showHint([IMAGE_HINT_WASD, IMAGE_HINT_ARROWS]);
			this.showingControlsHint = true;
		}
	}

	showActionHint() {
		if (!this.showingActionHint) {
			this.showHint([IMAGE_HINT_ACTION]);
			this.showingActionHint = true;
		}
	}

	showHint(images, size = 3, direction = NEIGHBOR_TYPE_UPPER_RIGHT) {
		if (this.hintController) {
			this.hintController.destroy();
			this.removeChild(this.hintController);
		}
		const hintModel = new HintModel();
		hintModel.position.set(this.grid.getPosition(BEE_CENTER));
		hintModel.imagePaths = images;
		hintModel.direction = direction;
		hintModel.size = size;
		this.hintController = new HintController(this.game, hintModel, this.controls, this.model.sprites);
		this.addChild(this.hintController);
		this.hintController.activate();
		this.hintController.show();
	}

	hideHint() {
		if (this.hintController) {
			this.hintController.hide();
		}
	}

}
