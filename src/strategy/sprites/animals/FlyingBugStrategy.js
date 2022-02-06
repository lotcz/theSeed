import Pixies from "../../../class/Pixies";
import AnimatedStrategy from "../AnimatedStrategy";

const FLYING_BUG_TIMEOUT = 300;
const FLYING_BUG_LANDING_TIMEOUT = 700;

const STATE_FLYING = 0;
const STATE_LANDING = 1;
const STATE_ATTACKING = 2;

const DEBUG_FLYING_BUG = false;

export default class FlyingBugStrategy extends AnimatedStrategy {
	lastDirection;

	constructor(game, model, controls) {
		super(game, model, controls, FLYING_BUG_TIMEOUT);

		this.flyingTimeout = this.model.data.timeout || FLYING_BUG_TIMEOUT;
		this.landingTimeout = this.model.data.landingTimeout || FLYING_BUG_LANDING_TIMEOUT;

		this.model.data.size = this.model.data.size || 1;

		this.lastDirection = null;
		this.model._is_penetrable = false;
		this.turningDuration = 200;

		this.visitorsPosition = null;
		this.positionChangedHandler = (p) => this.onPositionChanged(p);

		this.fly();
	}

	activateInternal() {
		super.activateInternal();
		this.model.position.addOnChangeListener(this.positionChangedHandler);
		this.updateVisitors();
	}

	deactivateInternal() {
		super.deactivateInternal();
		this.model.position.removeOnChangeListener(this.positionChangedHandler);
		if (this.visitorsPosition) {
			this.grid.getAffectedPositions(this.visitorsPosition, this.model.data.size).forEach((p) => this.chessboard.removeVisitor(p, this.model));
		}
	}

	updateStrategy() {
		let somethingNearby = false;

		const positions = this.grid.getAffectedPositions(this.model.position, 5);

		if (this.level.isPlayable && this.level.bee) {
			somethingNearby = positions.some((p) => this.level.bee.position.equalsTo(p));
			if (DEBUG_FLYING_BUG) console.log('bee near:', somethingNearby);
		}

		if (!somethingNearby) {
			somethingNearby = positions.some((p) => !this.level.isPenetrable(p, this.model));
			if (DEBUG_FLYING_BUG) console.log('something else near:', somethingNearby);
		}

		if (this.isFlying() && somethingNearby) {
			this.land();
		}

		if (this.isLanding() && !somethingNearby) {
			this.fly();
		}

		const neighbors = this.level.grid.getNeighbors(this.model.position);

		if (this.lastDirection && (Math.random() < 0.95)) {
			if (this.isDirectionFree(this.lastDirection)) {
				const next = neighbors[this.lastDirection];
				this.setTargetPosition(next);
				if (this.isLanding()) {
					this.model.image.flipped.set(next.x <= this.model.position.x);
				}
				return;
			}
		}

		const directions = [];
		for (let i = 0; i < neighbors.length; i++) directions.push(i);

		let direction = null;
		while (directions.length > 0) {
			const d = Pixies.randomElement(directions);
			if (this.isDirectionFree(d)) {
				direction = d;
				break;
			}
			directions.splice(directions.indexOf(d), 1);
		}

		if (direction !== null) {
			const next = neighbors[direction];
			this.lastDirection = direction;
			this.setTargetPosition(next);
			if (this.isLanding()) {
				this.model.image.flipped.set(next.x <= this.model.position.x);
			}
		}
	}

	isDirectionFree(direction) {
		const position = this.grid.getNeighbor(this.model.position, direction, this.model.data.size);
		const affected = this.grid.getAffectedPositions(position, this.model.data.size);
		const impenetrable = affected.some((p) => !this.level.isAir(p, this.model));
		return !impenetrable;
	}

	fly() {
		this.state = STATE_FLYING;
		this.oriented = false;
		this.turnWhenMoving = true;
		this.defaultTimeout = this.flyingTimeout;
		if (this.model.animations && this.model.animations.exists('flying')) {
			this.model.activeAnimation.set('flying');
		}
	}

	isFlying() {
		return this.state === STATE_FLYING;
	}

	land() {
		this.state = STATE_LANDING;
		this.oriented = false;
		this.turnWhenMoving = false;
		this.defaultTimeout = this.landingTimeout;
		if (this.model.animations && this.model.animations.exists('landing')) {
			this.model.activeAnimation.set('landing');
		}
		this.model.image.rotation.set(0);
	}

	isLanding() {
		return this.state === STATE_LANDING;
	}

	onPositionChanged(p) {
		this.updateVisitors();
	}

	updateVisitors() {
		if (this.model.data.size <= 1) {
			return;
		}
		if (this.visitorsPosition) {
			this.grid.getAffectedPositions(this.visitorsPosition, this.model.data.size).forEach((p) => this.chessboard.removeVisitor(p, this.model));
		}
		this.grid.getAffectedPositions(this.model.position, this.model.data.size).forEach((p) => this.chessboard.addVisitor(p, this.model));
		this.visitorsPosition = this.model.position.clone();
	}
}
