import ControllerBase from "../class/ControllerBase";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";
import {GROUND_TYPE_WAX} from "../builder/GroundStyle";

import Vector2 from "../class/Vector2";
import BeeFlightStrategy from "../strategy/BeeFlightStrategy";
import BeeCrawlStrategy from "../strategy/BeeCrawlStrategy";
import AnimationController from "./AnimationController";
import BeeDeathStrategy from "../strategy/BeeDeathStrategy";

export const BEE_CENTER = new Vector2(250, 250);
export const WINGS_OFFSET = BEE_CENTER.addX(50);
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
			this.model.health.set(this.model.health.get() - (secsDelta * 0.3));
		}

		if (this.model.health.get() <= 0) {
			this.die();
			return;
		}

		if (this.controls.interact) {
			const position = this.grid.getNeighborDown(this.model.position)
			const visitors = this.chessboard.getVisitors(position);
			const minerals = visitors.filter((v) => v._is_sprite && v.strategy.get() === STRATEGY_MINERAL);
			if (minerals.length > 0) {
				const item = minerals[0];
				item.image.coordinates.set(BEE_CENTER);
				item.data.carried = true;
				this.level.sprites.remove(item);
				this.model.inventory.add(item);
			} else {
				const wax = visitors.filter((v) => v._is_ground && v.type === GROUND_TYPE_WAX);
				if (wax.length > 0) {
					const tile = wax[0];
					this.level.ground.removeTile(tile);
				}
			}
			this.controls.interact = false;
		}

		if (this.controls.fire) {
			this.emptyInventory();
			this.controls.fire = false;
		}
	}

	fly() {
		this.model.crawling.set(null);
		this.crawlingAnimationController.deactivate();
		this.setStrategy(new BeeFlightStrategy(this.game, this.model, this.controls));
	}

	crawl(direction) {
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

	emptyInventory() {
		const item = this.model.inventory.removeFirst();
		if (item) {
			this.level.addResource(item.image.path.get());
			item.position.set(this.model.position);
			item.data.carried = false;
			this.level.sprites.add(item);
		}
	}

	updateMovement() {
		this.level.centerOnCoordinates(this.model.coordinates);
		this.level.sanitizeViewBox();
	}

}
