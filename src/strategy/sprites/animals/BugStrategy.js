import MovementStrategy from "../MovementStrategy";
import Pixies from "../../../class/Pixies";
import BiteSound from "../../../../res/sound/bite.wav";
import Sound from "../../../class/Sound";
import {SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_POTASSIUM} from "../../../builder/SpriteStyle";
import Vector2 from "../../../class/Vector2";
import MineralStrategy, {MINERAL_FALL_TIMEOUT} from "../minerals/MineralStrategy";

const BUG_TIMEOUT = 1000;
export const BUG_MAX_AMOUNT = 5;

export default class BugStrategy extends MovementStrategy {
	static biteSound = new Sound(BiteSound);

	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);

		if (!this.model.data.amount) {
			this.model.data.amount = this.model.image.scale.get();
		}
	}

	activateInternal() {
		this.updateOffset();
		this.updateScale();
		this.model._is_penetrable = false;
		super.activateInternal();
	}

	updateStrategy() {
		if (!this.level.isValidPosition(this.model.position)) {
			this.level.sprites.remove(this.model);
			console.log('Bug over board');
			return;
		}

		const lowerNeighbor = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(lowerNeighbor)) {
			this.defaultTimeout = MINERAL_FALL_TIMEOUT;
			this.setTargetPosition(lowerNeighbor);
			return;
		}

		this.defaultTimeout = BUG_TIMEOUT;

		const neighbors = this.level.grid.getNeighbors(this.model.position);
		neighbors.push(this.model.position);

		if (this.model.data.amount < BUG_MAX_AMOUNT) {
			let eaten = false;
			let i = 0;

			while (i < neighbors.length && !eaten) {
				const food = this.chessboard.getVisitors(neighbors[i], (v) => v._is_sprite === true && v.type === SPRITE_TYPE_POTASSIUM);
				if (food.length > 0) {
					const meal = food[0];
					const amount = 1; //Pixies.between(1, BUG_MAX_AMOUNT - this.model.data.amount, meal.data.amount);
					this.model.data.amount += amount;
					this.updateScale();
					this.updateOffset();
					meal.data.amount -= amount;
					if (meal.data.amount <= 0) {
						this.level.sprites.remove(meal);
					}
					if (this.level.isPlayable && this.level.bee) {
						if (this.model.position.distanceTo(this.level.bee.position) < 10) {
							BugStrategy.biteSound.play();
						}
					}
					eaten = true;
				}
				i++;
			}

			if (eaten) return;
		} else {
			this.level.addSpriteFromStyle(this.model.position, SPRITE_TYPE_BUG_EGG);
			this.model.data.amount = 1;
			this.updateScale();
			this.updateOffset();
		}

		if (this.level.isPlayable && this.level.bee) {
			const beePresent = neighbors.filter((n) => n.equalsTo(this.level.bee.position)).length > 0;
			if (beePresent) {
				BugStrategy.biteSound.replay();
				this.level.bee.hurt(0.5);
			}
		}

		const freeNeighbors = neighbors.filter((n) => this.level.isPenetrable(n));
		const surfaceNeighbors = freeNeighbors.filter((n) => this.level.isCrawlable(this.grid.getNeighborDown(n)));

		if (surfaceNeighbors.length > 0) {
			this.setTargetPosition(Pixies.randomElement(surfaceNeighbors));
		} else if (freeNeighbors.length > 0) {
			this.setTargetPosition(Pixies.randomElement(freeNeighbors));
		}
	}

	updateOffset() {
		if (this.model.data.amount < BUG_MAX_AMOUNT) {
			this.offset = new Vector2(0, this.grid.tileSize.y * 0.4 * (1 - (this.model.data.amount / BUG_MAX_AMOUNT)));
		} else {
			this.offset = null;
		}
	}

	updateScale() {
		const scale = MineralStrategy.getScale(this.model.data.amount);
		this.setTargetScale(scale);
	}

}
