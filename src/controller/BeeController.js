import ControllerBase from "../class/ControllerBase";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";
import {GROUND_TYPE_WAX} from "../builder/GroundStyle";

import Vector2 from "../class/Vector2";
import BeeFlightStrategy from "../strategy/BeeFlightStrategy";
import BeeCrawlStrategy from "../strategy/BeeCrawlStrategy";
import AnimationController from "./AnimationController";
import BeeDeathStrategy from "../strategy/BeeDeathStrategy";

export const BEE_CENTER = new Vector2(150, 150);

export default class BeeController extends ControllerBase {
	dead;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.dead = false;

		this.crawlingAnimationController = new AnimationController(this.game, this.model.crawlingAnimation, this.controls);
		this.addChild(this.crawlingAnimationController);

		this.model.coordinates.set(this.grid.getCoordinates(this.model.position));
		if (this.model.crawling.get()) {
			this.crawl(this.model.crawling.get())
		} else {
			this.fly();
		}
	}

	updateInternal(delta) {
		if (this.dead) {
			return;
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
				this.level.sprites.remove(minerals[0]);
				this.model.inventory.add(minerals[0]);
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
		this.setStrategy(new BeeFlightStrategy(this.game, this.model, this.controls));
	}

	crawl(direction) {
		this.model.crawling.set(direction);
		this.setStrategy(new BeeCrawlStrategy(this.game, this.model, this.controls));
	}

	die() {
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
			item.position.set(this.model.position);
			this.level.sprites.add(item);
		}
	}

}
