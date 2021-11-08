import ControllerBase from "../class/ControllerBase";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";
import {GROUND_TYPE_WAX} from "../builder/GroundStyle";

import Vector2 from "../class/Vector2";
import BeeFlightStrategy from "../strategy/BeeFlightStrategy";
import BeeCrawlStrategy from "../strategy/BeeCrawlStrategy";
import AnimationController from "./AnimationController";
import BeeDeathStrategy from "../strategy/BeeDeathStrategy";
import MineralStrategy, {MINERAL_MAX_AMOUNT} from "../strategy/MineralStrategy";
import {NEIGHBOR_TYPE_DOWN} from "../model/GridModel";

export const BEE_CENTER = new Vector2(250, 250);
const HEALING_SPEED = 0.1; // health per second

export default class BeeController extends ControllerBase {
	dead;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.dead = false;

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
	}

	activateInternal() {
		this.model.inventory.forEach((i) => this.level.addResource(i.image.path.get()));
		this.updateMovement();
	}

	updateInternal(delta) {
		if (this.dead) {
			return;
		}

		const secsDelta = delta / 1000;

		const isHurt = ((this.model.health.get() > 0) && (this.model.health.get() < 1));
		if (isHurt && !this.starsAnimationController.isActivated()) {
			this.model.starsAnimation.image.coordinates.set(BEE_CENTER);
			this.starsAnimationController.activate();
		}
		if (this.starsAnimationController.isActivated() && !isHurt) {
			this.starsAnimationController.deactivate();
		}

		if (this.model.health.get() < 1) {
			this.model.health.set(Math.min(this.model.health.get() + (HEALING_SPEED * secsDelta), 1));
		}

		if (this.level.isWater(this.model.position)) {
			this.die();
			return;
		}

		if (this.level.isCloud(this.model.position)) {
			this.model.health.set(this.model.health.get() - (secsDelta * 0.5));
			if (this.model.health.get() < 0.5) {
				this.emptyInventory();
			}
		}

		if (this.model.health.get() <= 0) {
			this.die();
			return;
		}

		const visitors = this.chessboard.getVisitors(this.model.position);
		const minerals = visitors.filter((v) => v._is_sprite && v.strategy.get() === STRATEGY_MINERAL);
		minerals.forEach((m) =>	this.takeItem(m));

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

	setStrategy(strategy) {
		if (this.strategy) this.removeChild(this.strategy);
		this.strategy = strategy;
		this.addChild(this.strategy);
		this.strategy.activate();
	}

	takeItem(item) {
		const sameType = this.model.inventory.children.find((i) => i.image.path.get() === item.image.path.get());
		if (this.model.inventory.count() > 0 && !sameType) {
			return;
		}
		if (sameType && (sameType.data.amount + item.data.amount) >= MINERAL_MAX_AMOUNT) {
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

}
