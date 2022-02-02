import ObjectStrategy from "../ObjectStrategy";
import Pixies from "../../../class/Pixies";
import BiteSound from "../../../../res/sound/bite.mp3";
import Sound from "../../../class/Sound";
import {GROUND_TYPE_WATER} from "../../../builder/GroundStyle";

const BUG_TIMEOUT = 1000;
const VISIBLE_DISTANCE = 5;
export const BUG_MAX_AMOUNT = 15;

export default class BugStrategy extends ObjectStrategy {
	static biteSound = new Sound(BiteSound);

	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);

		this.oriented = true;
		this.turnWhenMoving = true;
		this.maxAmount = BUG_MAX_AMOUNT;

		this.model._is_penetrable = (this.model.data.penetrable === true);
		this.model._is_crawlable = false;

		if (this.model.data.timeout !== undefined) {
			this.defaultMoveTimeout = this.model.data.timeout;
		}
		if (!this.model.data.consumes) {
			this.model.data.consumes = [];
		}
		if (!this.model.data.carries) {
			this.model.data.carries = [];
		}
		if (!this.model.data.repelledBy) {
			this.model.data.repelledBy = [];
		}
		if (!this.model.data.attractedBy) {
			this.model.data.attractedBy = [];
		}
	}

	activateInternal() {
		super.activateInternal();

		// fix bug when bugs fall down through terrain
		while (this.level.isGround(this.model.position)) {
			this.model.position.set(this.grid.getNeighborUp(this.model.position));
		}
	}

	updateStrategy() {
		const localVisitors = this.grid.chessboard.getVisitors(this.model.position);

		// FLOAT
		const isWater = localVisitors.some((v) => v._is_ground === true && v.type === GROUND_TYPE_WATER);
		if (isWater) {
			this.defaultTimeout = this.defaultFallTimeout;
			this.turnWhenMoving = false;
			const up = this.grid.getNeighborUp(this.model.position);
			this.setTargetPosition(up);
			this.setTargetRotation(0);
			return;
		}

		// FALL
		const down = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = this.defaultFallTimeout;
			this.turnWhenMoving = false;
			this.setTargetPosition(down);
			this.setTargetRotation(0);
			return;
		}

		this.decision(localVisitors);
	}

	decision(localVisitors) {
		const neighbors = this.grid.getValidNeighbors(this.model.position);

		// EAT NEARBY FOOD
		if (this.isHungry()) {
			const neighborVisitors = this.chessboard.getVisitorsMultiple(neighbors);
			const food = neighborVisitors.filter((v) => this.filterFood(v));
			if (food.length > 0) {
				this.eat(food[0]);
				return;
			}
		}

		// HURT BEE
		if (this.isBeeInRange()) {
			this.hurtBee();
			return;
		}

		// TAKE/DROP ITEM
		if (this.hasItem()) {
			if (Math.random() < 0.1) {
				this.dropItem();
				return;
			}
		} else {
			const item = localVisitors.find((v) => this.filterTakeable(v));
			if (item) {
				this.takeItem(item);
				return;
			}
		}

		// FLEE/APPROACH
		if (this.isAffectedByEnvironment()) {
			let step = 0;
			let firstLeft = null;
			let lastLeft = this.model.position;
			let firstRight = null;
			let lastRight = this.model.position;
			let leftBlocked = false;
			let rightBlocked = false;

			while (leftBlocked === false && rightBlocked === false && step < VISIBLE_DISTANCE) {
				if (!leftBlocked) {
					const left = this.getLeftWalkPath(lastLeft);
					if (left) {
						if (!firstLeft) {
							firstLeft = left;
						}
						const visitors = this.chessboard.getVisitors(left);
						const isThereRepellent = visitors.some((v) => this.filterRepellents(v));
						if (isThereRepellent) {
							if (firstRight) {
								this.walkTo(firstRight);
							} else {
								this.walkRight();
							}
							console.log('repelled from left', left);
							return;
						}
						const isThereAttraction = visitors.some((v) => this.filterAttractions(v));
						if (isThereAttraction) {
							this.walkTo(firstLeft);
							console.log('attracted to left', left);
							return;
						}
						lastLeft = left;
					} else {
						leftBlocked = true;
					}
				}
				if (!rightBlocked) {
					const right = this.getRightWalkPath(lastRight);
					if (right) {
						if (!firstRight) {
							firstRight = right;
						}
						const visitors = this.chessboard.getVisitors(right);
						const isThereRepellent = visitors.some((v) => this.filterRepellents(v));
						if (isThereRepellent) {
							if (firstLeft) {
								this.walkTo(firstLeft);
							} else {
								this.walkLeft();
							}
							console.log('repelled from right', right);
							return;
						}
						const isThereAttraction = visitors.some((v) => this.filterAttractions(v));
						if (isThereAttraction) {
							this.walkTo(firstRight);
							console.log('attracted to right', right);
							return;
						}
						lastRight = right;
					} else {
						rightBlocked = true;
					}
				}
				step += 1;
			}
		}

		// WANDER AROUND
		if (Math.random() < 0.5) {
			if (Math.random() < 0.5) {
				this.walkRight();
			} else {
				this.walkLeft();
			}
		}
	}

	filterFood(visitor) {
		return visitor._is_sprite && this.model.data.consumes.includes(visitor.type);
	}

	filterTakeable(visitor) {
		return visitor._is_sprite && this.model.data.carries.includes(visitor.type);
	}

	filterRepellents(visitor) {
		return visitor._is_sprite && this.model.data.repelledBy.includes(visitor.type);
	}

	filterAttractions(visitor) {
		return (this.filterFood(visitor) || this.filterTakeable(visitor) || (visitor._is_sprite && this.model.data.attractedBy.includes(visitor.type)));
	}

	isAffectedByEnvironment() {
		return ((this.model.data.repelledBy.length > 0) || (this.model.data.attractedBy.length > 0) || (this.model.data.carries.length > 0) || (this.model.data.consumes.length > 0));
	}

	isHungry() {
		return (this.model.data.consumes.length > 0);
	}

	eat(food) {
		if (!this.isHungry()) {
			return;
		}
		this.turnWhenMoving = false;
		const angle = this.model.image.coordinates.getRotation(food.image.coordinates);
		this.setTargetRotation(angle, 500);

		if (!this.isGrown()) {
			this.model.data.amount += 1;
			this.updateAmount();
		}
		food.data.amount -= 1;
		if (food.data.amount <= 0) {
			this.level.sprites.remove(food);
		}
		if (this.level.isPlayable && this.level.bee) {
			if (this.model.position.distanceTo(this.level.bee.position) < 10) {
				BugStrategy.biteSound.play();
			}
		}
	}

	isBeeInRange() {
		if (this.level.isPlayable && this.level.bee && this.model.data.hurts && (this.game.beeState.health.get() > 0)) {
			return (this.model.position.distanceTo(this.level.bee.position) < (this.grid.tileRadius * 1.2));
		} else {
			return false;
		}
	}

	hurtBee() {
		this.turnWhenMoving = false;
		BugStrategy.biteSound.replay();
		this.game.beeState.hurt(this.model.data.hurts);
		const angle = this.model.image.coordinates.getRotation(this.level.bee.coordinates);
		this.setTargetRotation(angle, 500);
	}

	die() {
		if (this.model.data.deadSprite === undefined) {
			return;
		}
		this.level.addSpriteFromStyle(this.model.position, this.model.data.deadSprite);
		this.level.sprites.remove(this.model);
	}

	spawnEgg() {
		/*
		this.level.addSpriteFromStyle(this.grid.getNeighborUp(this.model.position), SPRITE_TYPE_BUG_EGG);
		this.model.data.amount -= 1;
		 */
	}

	hasItem() {
		return this.model.attachedSprite.isSet();
	}

	takeItem(item) {
		this.level.sprites.remove(item);
		item.setDeleted(false);
		this.model.attachedSprite.set(item);
	}

	dropItem() {
		if (!this.hasItem()) {
			return;
		}
		const item = this.model.attachedSprite.get();
		item.position.set(this.grid.getNeighborUp(this.model.position));
		this.model.attachedSprite.set(null);
		this.level.sprites.add(item);
		return item;
	}

	isGrown() {
		return (this.model.data.amount >= this.maxAmount);
	}

	isWalkablePath(position) {
		return this.level.isPenetrable(position) && this.level.isCrawlable(this.grid.getNeighborDown(position));
	}

	getLeftWalkPath(position) {
		const ll = this.grid.getNeighborLowerLeft(position);
		if (this.isWalkablePath(ll)) {
			return ll;
		}
		const ul = this.grid.getNeighborUpperLeft(position);
		if (this.isWalkablePath(ul)) {
			return ul;
		}
		return null;
	}

	getRightWalkPath(position) {
		const lr = this.grid.getNeighborLowerRight(position);
		if (this.isWalkablePath(lr)) {
			return lr;
		}
		const ur = this.grid.getNeighborUpperRight(position);
		if (this.isWalkablePath(ur)) {
			return ur;
		}
		return null;
	}

	walkLeft() {
		this.walkTo(this.getLeftWalkPath(this.model.position));
	}

	walkRight() {
		this.walkTo(this.getRightWalkPath(this.model.position));
	}

	walkTo(position) {
		if (!position) {
			return;
		}
		this.defaultTimeout = this.defaultMoveTimeout;
		this.turnWhenMoving = true;
		this.setTargetPosition(position);
	}

}
