import ObjectStrategy from "../ObjectStrategy";
import Pixies from "../../../class/Pixies";
import BiteSound from "../../../../res/sound/bite.wav";
import Sound from "../../../class/Sound";
import {SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_POTASSIUM} from "../../../builder/SpriteStyle";
import Vector2 from "../../../class/Vector2";
import MineralStrategy, {MINERAL_FALL_TIMEOUT} from "../minerals/MineralStrategy";

const BUG_TIMEOUT = 1000;
export const BUG_MAX_AMOUNT = 5;

export default class BugStrategy extends ObjectStrategy {
	static biteSound = new Sound(BiteSound);

	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);

		this.oriented = true;
		this.turnWhenMoving = true;
		this.maxAmount = BUG_MAX_AMOUNT;

		this.model._is_penetrable = false;
	}

	updateStrategy() {
		const neighbors = this.level.grid.getNeighbors(this.model.position);
		neighbors.push(this.model.position);

		if (this.model.data.amount < this.maxAmount) {
			let eaten = false;
			let i = 0;

			while (i < neighbors.length && !eaten) {
				const food = this.chessboard.getVisitors(neighbors[i], (v) => v._is_sprite === true && v.type === SPRITE_TYPE_POTASSIUM);
				if (food.length > 0) {
					const meal = food[0];

					const angle = this.model.image.coordinates.getAngleToY(meal.image.coordinates);
					this.setTargetRotation(angle, 500);

					const amount = 1; //Pixies.between(1, BUG_MAX_AMOUNT - this.model.data.amount, meal.data.amount);
					this.model.data.amount += amount;
					meal.data.amount -= amount;
					if (meal.data.amount <= 0) {
						this.level.sprites.remove(meal);
					}
					if (this.level.isPlayable && this.level.bee) {
						if (this.model.position.distanceTo(this.level.bee.position) < 10) {
							BugStrategy.biteSound.play();
						}
					}
					this.turnWhenMoving = false;
					eaten = true;
				}
				i++;
			}

			if (eaten) return;
		} else {
			this.level.addSpriteFromStyle(this.grid.getNeighborUp(this.model.position), SPRITE_TYPE_BUG_EGG);
			this.model.data.amount = 1;
			return;
		}

		if (this.level.isPlayable && this.level.bee) {
			const beePresent = neighbors.filter((n) => n.equalsTo(this.level.bee.position)).length > 0;
			if (beePresent) {
				BugStrategy.biteSound.replay();
				this.level.bee.hurt(this.model.data.amount * 0.1);
				const angle = this.model.image.coordinates.getAngleToY(this.level.bee.coordinates);
				this.setTargetRotation(angle, 500);
				return;
			}
		}

		const down = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = this.defaultFallTimeout;
			this.turnWhenMoving = false;
			this.setTargetRotation(180, 500);
			this.setTargetPosition(down);
			return;
		}

		const validNeighbors = [this.grid.getNeighborUpperLeft(this.model.position), this.grid.getNeighborUpperRight(this.model.position), this.grid.getNeighborLowerLeft(this.model.position), this.grid.getNeighborLowerRight(this.model.position)];
		const freeNeighbors = validNeighbors.filter((n) => this.level.isPenetrable(n));
		const surfaceNeighbors = freeNeighbors.filter((n) => this.level.isCrawlable(this.grid.getNeighborDown(n)));

		if (surfaceNeighbors.length > 0) {
			this.defaultTimeout = this.defaultMoveTimeout;
			this.turnWhenMoving = true;
			this.setTargetPosition(Pixies.randomElement(surfaceNeighbors));
		}
	}

}
