import UpdatedStrategy from "./UpdatedStrategy";
import AnimatedValue from "../../class/AnimatedValue";
import AnimatedVector2 from "../../class/AnimatedVector2";
import AnimatedRotation from "../../class/AnimatedRotation";
import RotationValue from "../../class/RotationValue";

const DEFAULT_TURNING_DURATION = 500;

export default class AnimatedStrategy extends UpdatedStrategy {
	animatedCoordinates;
	animatedRotation;
	animatedScale;
	offset;
	turnWhenMoving;
	oriented;

	constructor(game, model, controls, timeout) {
		super(game, model, controls, timeout);

		this.animatedCoordinates = null;
		this.animatedRotation = null;
		this.animatedScale = null;
		this.offset = null;
		this.turnWhenMoving = false;
		this.oriented = false;
		this.turningDuration = DEFAULT_TURNING_DURATION;
	}

	activateInternal() {
		super.activateInternal();
		this.model.image.coordinates.set(this.getCoords(this.model.position));
	}

	getCoords(position) {
		const coords = this.grid.getCoordinates(position);
		if (!this.offset) {
			return coords;
		}
		return coords.add(this.offset);
	}

	setTargetRotation(rotation, timeout = null) {
		if (!this.model.image.rotation.equalsTo(rotation)) {
			if (timeout === null) timeout = this.defaultTimeout;
			if (this.oriented) {
				this.animatedRotation = new AnimatedValue(RotationValue.normalizeValue(this.model.image.rotation.get() + 180), RotationValue.normalizeValue(rotation + 180), timeout);
			} else {
				this.animatedRotation = new AnimatedRotation(this.model.image.rotation.get(), rotation, timeout);
			}
		} else {
			this.animatedRotation = null;
		}
	}

	setTargetScale(scale) {
		if (!this.model.image.scale.equalsTo(scale)) {
			this.animatedScale = new AnimatedValue(this.model.image.scale.get(), scale, this.defaultTimeout);
		}
	}

	setTargetPosition(position) {
		if (!this.model.position.equalsTo(position)) {
			this.setTargetCoordinates(this.getCoords(position));
		}
	}

	setTargetCoordinates(coordinates) {
		if (!this.model.image.coordinates.equalsTo(coordinates)) {
			this.animatedCoordinates = new AnimatedVector2(this.model.image.coordinates, coordinates, this.defaultTimeout);
			if (this.turnWhenMoving) this.setTargetRotation(this.model.image.coordinates.getRotation(coordinates), this.turningDuration);
		}
	}

	isMoving() {
		return (this.animatedCoordinates !== null);
	}

	updateInternal(delta) {
		if (this.animatedRotation) {
			let rotation = this.animatedRotation.get(delta);
			if (this.oriented) {
				rotation += 180;
			}
			this.model.image.rotation.set(rotation);
			if (this.model.attachedSprite.isSet()) {
				this.model.attachedSprite.get().image.rotation.set(rotation);
			}
			if (this.animatedRotation.isFinished()) {
				this.animatedRotation = null;
			}
			if (this.oriented) {
				const flipped = this.model.image.rotation.get() > 0;
				this.model.image.flipped.set(flipped);
				if (this.model.attachedSprite.isSet()) {
					this.model.attachedSprite.get().image.flipped.set(flipped);
				}
			}
		}

		if (this.animatedScale) {
			const scale = this.animatedScale.get(delta);
			this.model.image.scale.set(scale);
			/*
			if (this.model.attachedSprite.isSet()) {
				this.model.attachedSprite.get().image.scale.set(scale);
			}
			*/
			if (this.animatedScale.isFinished()) {
				this.animatedScale = null;
			}
		}

		if (this.animatedCoordinates) {
			const coords = this.animatedCoordinates.get(delta);
			this.model.image.coordinates.set(coords);
			if (this.model.attachedSprite.isSet()) {
				this.model.attachedSprite.get().image.coordinates.set(coords);
			}
			if (this.animatedCoordinates.isFinished()) {
				this.animatedCoordinates = null;
			}
			const position = this.grid.getPosition(this.model.image.coordinates);
			if (!this.model.position.equalsTo(position)) {
				this.setPosition(position);
			}
		}
	}

}
