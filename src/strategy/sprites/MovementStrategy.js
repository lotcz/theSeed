import Pixies from "../../class/Pixies";
import RotationValue from "../../class/RotationValue";
import UpdatedStrategy from "./UpdatedStrategy";
import AnimatedValue from "../../class/AnimatedValue";
import AnimatedVector2 from "../../class/AnimatedVector2";

export default class MovementStrategy extends UpdatedStrategy {
	animatedCoordinates;
	animatedRotation;
	animatedScale;

	constructor(game, model, controls, timeout) {
		super(game, model, controls, timeout);

		this.animatedCoordinates = null;
		this.animatedRotation = null;
		this.animatedScale = null;
	}

	activateInternal() {
		super.activateInternal();
		this.model.image.coordinates.set(this.grid.getCoordinates(this.model.position));
	}

	selectRandomTarget() {
		const neighbors = this.level.grid.getNeighbors(this.model.position);
		this.setTargetPosition(Pixies.randomElement(neighbors));
	}

	setTargetRotation(rotation, timeout = null) {
		if (!this.model.image.rotation.equalsTo(rotation)) {
			if (timeout === null) timeout = this.defaultTimeout;
			this.animatedRotation = new AnimatedValue(this.model.image.rotation.get(), RotationValue.normalizeValue(rotation), timeout);
		}
	}

	setTargetScale(scale) {
		if (!this.model.image.scale.equalsTo(scale)) {
			this.animatedScale = new AnimatedValue(this.model.image.scale.get(), scale, this.defaultTimeout);
		}
	}

	setTargetPosition(position) {
		if (!this.model.position.equalsTo(position)) {
			this.setTargetCoordinates(this.grid.getCoordinates(position));
		}
	}

	setTargetCoordinates(coordinates) {
		if (!this.model.image.coordinates.equalsTo(coordinates)) {
			this.animatedCoordinates = new AnimatedVector2(this.model.image.coordinates, coordinates, this.defaultTimeout);
			this.setTargetRotation(this.model.image.coordinates.getAngleToY(coordinates), 500);
		}
	}

	updateInternal(delta) {
		if (this.animatedRotation) {
			this.model.image.rotation.set(this.animatedRotation.get(delta));
			if (this.animatedRotation.isFinished()) {
				this.animatedRotation = null;
			}
			if (this.model.oriented.get()) {
				this.model.image.flipped.set(this.model.image.rotation.get() < 0);
			}
		}

		if (this.animatedScale) {
			this.model.image.scale.set(this.animatedScale.get(delta));
			if (this.animatedScale.isFinished()) {
				this.animatedScale = null;
			}
		}

		if (this.animatedCoordinates) {
			this.model.image.coordinates.set(this.animatedCoordinates.get(delta));
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
