import ObjectStrategy from "../ObjectStrategy";
import Pixies from "../../../class/Pixies";
import BiteSound from "../../../../res/sound/bite.wav";
import Sound from "../../../class/Sound";
import {SPRITE_TYPE_BUG_DEAD, SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_POTASSIUM} from "../../../builder/SpriteStyle";
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

		if (this.level.isWater(this.model.position)) {
			this.defaultTimeout = this.defaultFallTimeout;
			this.turnWhenMoving = false;
			const up = this.grid.getNeighborUp(this.model.position);
			this.setTargetPosition(up);
			this.setTargetRotation(0);
			return;
		}

		const down = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = this.defaultFallTimeout;
			this.turnWhenMoving = false;
			this.setTargetPosition(down);
			this.setTargetRotation(0);
			return;
		}

		const neighbors = this.level.grid.getNeighbors(this.model.position);
		neighbors.push(this.model.position);

		if (this.model.data.amount < this.maxAmount) {
			let eaten = false;
			let i = 0;

			while (i < neighbors.length && !eaten) {
				const food = this.chessboard.getVisitors(neighbors[i], (v) => v._is_sprite === true && v.type === SPRITE_TYPE_POTASSIUM);
				if (food.length > 0) {
					const meal = food[0];

					const angle = this.model.image.coordinates.getRotation(meal.image.coordinates);
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
			this.spawnEgg();
			//this.die();
			return;
		}

		if (this.level.isPlayable && this.level.bee) {
			const beePresent = neighbors.filter((n) => n.equalsTo(this.level.bee.position)).length > 0;
			if (beePresent) {
				BugStrategy.biteSound.replay();
				this.level.bee.hurt(this.model.data.amount * 0.1);
				const angle = this.model.image.coordinates.getRotation(this.level.bee.coordinates);
				this.setTargetRotation(angle, 500);
				return;
			}
		}

		/*
		if (this.dropEgg()) {
			return;
		}
*/
		if (!this.hasEgg()) {
			const eggs = this.chessboard.getVisitorsMultiple(neighbors, (v) => v._is_sprite && v.type === SPRITE_TYPE_BUG_EGG);
			if (eggs.length > 0) {
				const egg = eggs[0];
				this.level.sprites.remove(egg);
				egg.setDeleted(false);
				this.model.attachedSprite.set(egg);
				return;
			}
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

	die() {
		this.level.addSpriteFromStyle(this.model.position, SPRITE_TYPE_BUG_DEAD);
		this.level.sprites.remove(this.model);
	}

	hasEgg() {
		return this.model.attachedSprite.isSet();
	}

	spawnEgg() {
		this.level.addSpriteFromStyle(this.grid.getNeighborUp(this.model.position), SPRITE_TYPE_BUG_EGG);
		this.model.data.amount -= 1;
	}

	dropEgg() {
		if (this.hasEgg()) {
			const egg = this.model.attachedSprite.get();
			egg.position.set(this.grid.getNeighborUp(this.model.position));
			this.model.attachedSprite.set(null);
			this.level.sprites.add(egg);
			return egg;
		}
		return false;
	}

}
