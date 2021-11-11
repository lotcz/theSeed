import ControllerBase from "../class/ControllerBase";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";
import {GROUND_TYPE_WAX} from "../builder/GroundStyle";

import Vector2 from "../class/Vector2";
import BeeFlightStrategy from "../strategy/bee/BeeFlightStrategy";
import BeeCrawlStrategy from "../strategy/bee/BeeCrawlStrategy";
import AnimationController from "./AnimationController";
import BeeDeathStrategy from "../strategy/bee/BeeDeathStrategy";
import MineralStrategy from "../strategy/sprites/minerals/MineralStrategy";
import {NEIGHBOR_TYPE_DOWN} from "../model/GridModel";
import BeeLeavingStrategy from "../strategy/bee/BeeLeavingStrategy";

export const BEE_CENTER = new Vector2(250, 250);
const HEALING_SPEED = 0.1; // health per second
const MAX_INVENTORY_AMOUNT = 3;
const DROP_ITEM_TIMEOUT = 1000;

export default class BeeController extends ControllerBase {
	dead;
	dropItemTimeout;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.dead = false;
		this.dropItemTimeout = 0;

		this.crawlingAnimationController = new AnimationController(this.game, this.model.crawlingAnimation, this.controls);
		this.addChild(this.crawlingAnimationController);

		this.starsAnimationController = new AnimationController(this.game, this.model.starsAnimation, this.controls);
		this.addChild(this.starsAnimationController);

		this.model.coordinates.set(this.grid.getCoordinates(this.model.position));
		if (this.model.crawling.get()) {
			this.crawl(this.model.crawling.get())
		} else {
			this.fly();
		}

		this.model.addOnTravelListener(() => this.leave());
		this.model.addOnHurtListener((amount) => this.onHurt(amount));
	}

	activateInternal() {
		this.model.inventory.forEach((i) => this.level.addResource(i.image.path.get()));
		this.updateMovement();
	}

	updateInternal(delta) {
		if (this.dead || this.travelling) {
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

		if (this.controls.fire) {
			this.dropItem();
			this.controls.fire = false;
		}
	}

	fly() {
		this.model.inventory.forEach((i) => i.image.coordinates.set(BEE_CENTER.addY(80)));
		this.model.crawling.set(null);
		this.crawlingAnimationController.deactivate();
		this.setStrategy(new BeeFlightStrategy(this.game, this.model, this.controls));
	}

	crawl(direction) {
		this.model.inventory.forEach((i) => i.image.coordinates.set(BEE_CENTER));
		this.model.crawling.set(direction);
		this.crawlingAnimationController.activate();
		this.setStrategy(new BeeCrawlStrategy(this.game, this.model, this.controls));
	}

	die() {
		this.crawlingAnimationController.deactivate();
		this.starsAnimationController.deactivate();
		this.dead = true;
		this.setStrategy(new BeeDeathStrategy(this.game, this.model, this.controls));
	}

	leave() {
		this.setStrategy(new BeeLeavingStrategy(this.game, this.model, this.controls));
	}

	setStrategy(strategy) {
		if (this.strategy) this.removeChild(this.strategy);
		this.strategy = strategy;
		this.addChild(this.strategy);
		this.strategy.activate();
	}

	inspectForMinerals(position) {
		if (this.carriedAmount() >= MAX_INVENTORY_AMOUNT) {
			return;
		}
		const visitors = this.chessboard.getVisitors(position);
		const minerals = visitors.filter((v) => v._is_sprite && v.strategy.get() === STRATEGY_MINERAL);
		minerals.forEach((m) =>	this.takeItem(m));
	}

	carriedAmount() {
		return this.model.inventory.children.reduce((prev, current) => prev + current.data.amount, 0);
	}

	takeItem(item) {
		if (this.dropItemTimeout > 0) {
			return;
		}
		const sameType = this.model.inventory.children.find((i) => i.type === item.type);
		if (this.model.inventory.count() > 0 && !sameType) {
			return;
		}
		if (sameType && (sameType.data.amount + item.data.amount) >= MAX_INVENTORY_AMOUNT) {
			return;
		}
		this.level.sprites.remove(item);
		if (sameType) {
			sameType.data.amount += item.data.amount;
			sameType.image.scale.set(MineralStrategy.getScale(sameType.data.amount));
		} else {
			this.model.inventory.add(item);
			item.image.scale.set(MineralStrategy.getScale(item.data.amount));
		}
		if (this.model.isFlying()) {
			item.image.coordinates.set(BEE_CENTER.addY(80));
		} else {
			item.image.coordinates.set(BEE_CENTER);
		}
	}

	dropItem() {
		const item = this.model.inventory.removeFirst();
		if (item) {
			const down = this.grid.getNeighbor(this.model.position, NEIGHBOR_TYPE_DOWN);
			const position = this.level.isPenetrable(down) ? down : this.model.position;
			this.level.addResource(item.image.path.get());
			item.position.set(position);
			this.level.sprites.add(item);
			this.dropItemTimeout = DROP_ITEM_TIMEOUT;
		}
	}

	emptyInventory() {
		while (this.model.inventory.count() > 0) {
			this.dropItem();
		}
	}

	updateMovement() {
		this.level.centerOnCoordinates(this.model.coordinates);
		this.level.sanitizeViewBox();
	}

	onHurt(amount) {
		console.log('hurt', amount);
		if (amount > 0.3 || this.model.health.get() < 0.5) {
			this.dropItem();
		}
	}

}
