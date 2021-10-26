import ControllerBase from "../class/ControllerBase";
import Pixies from "../class/Pixies";
import RotationValue from "../class/RotationValue";

const ROTATION_SPEED = 1000;
const SCALING_SPEED = 100;

export default class SpriteControllerStrategy extends ControllerBase {
	position;
	coordinates;
	rotation;
	defaultTimeout;
	timeout;
	target;
	targetRotation;
	targetScale;
	movementEnabled;
	turningEnabled;
	scalingEnabled;
	lastVisited;

	constructor(game, model, controls, timeout) {
		super(game, model, controls);

		this.position = model.position;
		this.lastVisited = null;
		this.target = null;
		this.targetRotation = new RotationValue();
		this.rotation = new RotationValue();
		this.targetScale = null;

		this.coordinates = null;

		if (model.image) {
			this.coordinates = model.image.coordinates;
			this.rotation = model.image.rotation;
			this.targetRotation.set(this.rotation.get());
			this.scale = model.image.scale;
			this.targetScale = this.scale.get();
		}

		this.defaultTimeout = timeout;
		this.timeout = Math.random() * this.defaultTimeout;

		this.movementEnabled = true;
		this.turningEnabled = true;
		this.scalingEnabled = true;

	}

	activateInternal() {
		if (this.position) {
			if (this.movementEnabled) this.coordinates.set(this.grid.getCoordinates(this.position));
			this.visit(this.position);
		}
	}

	deactivateInternal() {
		if (this.lastVisited) this.chessboard.removeVisitor(this.lastVisited, this.model);
	}

	selectRandomTarget() {
		const neighbors = this.level.grid.getNeighbors(this.position);
		this.setTarget(Pixies.randomElement(neighbors));
	}

	visit(position) {
		if (this.lastVisited) this.chessboard.removeVisitor(this.lastVisited, this.model);
		this.lastVisited = position.clone();
		this.chessboard.addVisitor(position, this.model);
	}

	setTarget(target) {
		if (this.position.equalsTo(target)) {
			this.target = null;
			return;
		}
		if (target) {
			this.target = target.clone();
			this.visit(target);
		}
	}

	setPosition(position) {
		this.position.set(position);
	}

	onClick(e) {

	}

	selectTargetInternal() {
		//this.selectRandomTarget();
	}

	update(delta) {

		if (this.turningEnabled) {
			if (this.targetRotation.get() !== this.rotation.get()) {
				let diff = RotationValue.normalizeValue(this.rotation.get() - this.targetRotation.get());
				const step = Pixies.between(-diff, diff, (diff > 0 ? -1 : 1) * 360 * (delta / ROTATION_SPEED));
				this.rotation.set((this.rotation.get() + step));
				if (this.model.oriented.get()) {
					this.model.image.flipped.set(this.rotation.get() < 0);
				}
			}
		}

		if (this.scalingEnabled) {
			if (this.targetScale !== this.scale.get()) {
				const diff = this.targetScale - this.scale.get();
				const scale = Pixies.between(this.scale.get(), this.targetScale, this.scale.get() + (delta * (diff > 0) ? 1 : -1) / SCALING_SPEED);
				this.scale.set(scale);
			}
		}

		if (this.timeout <= 0) {
			if (this.target) this.setPosition(this.target);
			if (!this.game.isInEditMode.get()) {
				this.selectTargetInternal();
			}
			this.timeout = this.defaultTimeout;
		}

		this.timeout -= delta;

		this.updateInternal(delta);

		if (!this.coordinates) return;

		if (this.target && !this.position.equalsTo(this.target)) {
			const progress = (this.defaultTimeout - this.timeout) / this.defaultTimeout;
			const a = this.grid.getCoordinates(this.position);
			const b = this.grid.getCoordinates(this.target);

			if (this.movementEnabled) {
				const diff = b.subtract(a);
				const v = a.add(diff.multiply(progress));
				this.coordinates.set(v);
			}

			if (this.turningEnabled) {
				this.targetRotation.set(a.getAngleToY(b));
			}

		} else {
			this.coordinates.set(this.grid.getCoordinates(this.position));
		}

	}

}
