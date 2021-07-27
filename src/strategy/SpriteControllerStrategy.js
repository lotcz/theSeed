import ControllerBase from "../controller/ControllerBase";
import Pixies from "../class/Pixies";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

const ROTATION_SPEED = 1000;

export default class SpriteControllerStrategy extends ControllerBase {
	position;
	coordinates;
	rotation;
	defaultTimeout;
	timeout;
	target;
	targetRotation;
	movementEnabled;
	turningEnabled;

	constructor(game, model, controls, timeout) {
		super(game, model, controls);

		this.position = model.image.position;
		this.target = null;
		this.coordinates = model.image.coordinates;
		this.rotation = model.image.rotation;
		this.targetRotation = new RotationValue(this.rotation.get());
		this.defaultTimeout = timeout;
		this.timeout = this.defaultTimeout;

		this.movementEnabled = true;
		this.turningEnabled = true;

		this.game.level.grid.chessboard.addVisitor(this.position, this);
	}

	selectRandomTarget() {
		const neighbors = this.game.level.grid.getNeighbors(this.position);
		this.setTarget(Pixies.randomElement(neighbors));
	}

	setTarget(target) {
		this.game.level.grid.chessboard.removeVisitor(this.position, this);
		this.target = target;
		this.game.level.grid.chessboard.addVisitor(this.target, this);
	}

	setPosition(position) {
		this.position.set(position);
	}

	updateInternal(delta) {

	}

	selectTargetInternal() {
		this.selectRandomTarget();
	}

	update(delta) {
		if (this.turningEnabled) {
			if (this.targetRotation.get() !== this.rotation.get()) {
				let diff = RotationValue.normalizeValue(this.rotation.get() - this.targetRotation.get());

				const step = Pixies.between(-diff, diff, (diff > 0 ? -1 : 1) * 360 * (delta / ROTATION_SPEED));
				this.rotation.set((this.rotation.get() + step));
			}
		}

		if (this.timeout <= 0) {
			if (this.target) this.setPosition(this.target);
			this.selectTargetInternal();
			this.timeout = this.defaultTimeout;
		}

		this.timeout -= delta;

		this.updateInternal(delta);

		if (this.target && !this.position.equalsTo(this.target)) {
			const progress = (this.defaultTimeout - this.timeout) / this.defaultTimeout;
			const a = this.game.level.grid.getCoordinates(this.position);
			const b = this.game.level.grid.getCoordinates(this.target);

			if (this.movementEnabled) {
				const diff = b.subtract(a);
				const v = a.add(diff.multiply(progress));
				this.coordinates.set(v);
			}

			if (this.turningEnabled) {
				this.targetRotation.set(a.getAngleToY(b));
			}

		} else {
			this.coordinates.set(this.game.level.grid.getCoordinates(this.position));
			this.targetRotation.set(0);
		}

	}

}
