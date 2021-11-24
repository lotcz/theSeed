import ControllerBase from "../class/ControllerBase";
import {
	IMAGE_HINT_ACTION,
	IMAGE_HINT_ARROWS,
	IMAGE_HINT_WASD,
	SPRITE_STYLES,
	SPRITE_TYPE_BEE_LIFE,
	STRATEGY_DOOR_SLOT,
	STRATEGY_MINERAL,
	STRATEGY_OBJECT
} from "../builder/SpriteStyle";

import Vector2 from "../class/Vector2";
import BeeFlightStrategy from "../strategy/bee/BeeFlightStrategy";
import BeeCrawlStrategy from "../strategy/bee/BeeCrawlStrategy";
import AnimationController from "./AnimationController";
import BeeDeathStrategy from "../strategy/bee/BeeDeathStrategy";
import {NEIGHBOR_TYPE_DOWN, NEIGHBOR_TYPE_UPPER_RIGHT} from "../model/GridModel";

import OuchSound1 from "../../res/sound/ouch-1.mp3";
import OuchSound2 from "../../res/sound/ouch-2.mp3";
import DropSound from "../../res/sound/pop.mp3";
import Sound from "../class/Sound";
import SpriteCollectionController from "./SpriteCollectionController";
import HintModel from "../model/HintModel";
import HintController from "./HintController";
import ObjectStrategy, {DEFAULT_OBJECT_MAX_AMOUNT} from "../strategy/sprites/ObjectStrategy";
import Pixies from "../class/Pixies";

export const BEE_CENTER = new Vector2(1000, 1000);
const HEALING_SPEED = 0.1; // health per second
const MAX_INVENTORY_AMOUNT = DEFAULT_OBJECT_MAX_AMOUNT;
const DROP_ITEM_TIMEOUT = 1000;

export default class BeeController extends ControllerBase {
	static ouchSounds = [new Sound(OuchSound1), new Sound(OuchSound2)];
	static dropSound = new Sound(DropSound);
	dead;
	leaving;
	dropItemTimeout;
	showingControlsHint;
	showingActionHint;
	showingDoorsHint;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.dead = false;
		this.leaving = null;
		this.dropItemTimeout = 0;
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
		this.model.addOnHurtListener(this.onHurtHandler);
	}

	deactivateInternal() {
		this.model.removeOnTravelListener(this.onTravelHandler);
		this.model.removeOnHurtListener(this.onHurtHandler);
	}

	updateInternal(delta) {
		if (this.dead || this.leaving) {
			return;
		}

		const secsDelta = delta / 1000;

		if (this.level.isCloud(this.model.position)) {
			this.model.hurt(secsDelta);
		}

		if (this.model.health.get() <= 0) {
			this.die();
			return;
		}

		if (this.level.isWater(this.model.position)) {
			this.die();
			return;
		}

		const isHurt = this.model.health.get() < 1;
		if (isHurt) {
			if (!this.starsAnimationController.isActivated()) {
				this.model.starsAnimation.image.coordinates.set(BEE_CENTER);
				this.starsAnimationController.activate();
			}
			this.model.heal(HEALING_SPEED * secsDelta);
		} else {
			if (this.starsAnimationController.isActivated()) {
				this.starsAnimationController.deactivate();
			}
		}

		if (this.dropItemTimeout > 0) {
			this.dropItemTimeout -= delta;
		} else {
			this.inspectForMinerals(this.model.position);
		}

		if (this.controls.interacting.get()) {
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
	}

	inspectForMinerals(position) {
		const visitors = this.chessboard.getVisitors(position);
		const lives = visitors.filter((v) => v._is_sprite && v.type === SPRITE_TYPE_BEE_LIFE);
		lives.forEach((l) => {
			this.game.maxLives.set(this.game.maxLives.get() + 1);
			this.game.lives.set(this.game.lives.get() + 1);
			this.level.sprites.remove(l);
		});

		const doors = visitors.filter((v) => v._is_sprite && (v.strategy.get() === STRATEGY_DOOR_SLOT));
		if (doors.length > 0) {
			const data = doors[0].data;
			const key = data && data.key;
			const style = SPRITE_STYLES[key];
			if (!style) {
				console.log('Door style not found!', key, doors[0]);
			} else {
				this.showingDoorsHint = true;
				this.showHint([style.image.uri], 2);
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
		if (sameType && (sameType.data.amount + item.data.amount) >= MAX_INVENTORY_AMOUNT) {
			return;
		}
		this.level.sprites.remove(item);
		if (sameType) {
			sameType.data.amount += item.data.amount;
		} else {
			this.model.inventory.set(item);
		}
		this.updateInventory();
	}

	dropItem() {
		if (this.model.inventory.isEmpty()) {
			return;
		}
		if (this.showingActionHint) {
			this.hideHint();
			this.game.setHistory('hint-action-displayed');
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
		if (amount > 0.3 || this.model.health.get() < 0.5) {
			this.dropItem();
		}
	}

	showControlsHint() {
		this.showHint([IMAGE_HINT_WASD, IMAGE_HINT_ARROWS]);
		this.showingControlsHint = true;
	}

	showActionHint() {
		this.showHint([IMAGE_HINT_ACTION]);
		this.showingActionHint = true;
	}

	showHint(images, size = 3) {
		if (!this.hintController || !this.hintController.isInitialized()) {
			const hintModel = new HintModel();
			hintModel.position.set(this.grid.getPosition(BEE_CENTER));
			hintModel.imagePaths = images;
			hintModel.direction = NEIGHBOR_TYPE_UPPER_RIGHT;
			hintModel.size = size;
			this.hintController = new HintController(this.game, hintModel, this.controls, this.model.sprites);
			this.addChild(this.hintController);
			this.hintController.activate();
		}
		this.hintController.show();
	}

	hideHint() {
		if (this.hintController) {
			this.hintController.hide();
		}
	}

}
