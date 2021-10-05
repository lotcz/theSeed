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
	lastVisited;

	constructor(game, model, controls, timeout) {
		super(game, model, controls);

		this.position = model.position;
		this.lastVisited = null;
		this.target = null;
		this.coordinates = model.image.coordinates;
		this.rotation = model.image.rotation;
		this.targetRotation = new RotationValue(this.rotation.get());
		this.defaultTimeout = timeout;
		this.timeout = Math.random() * this.defaultTimeout;

		this.movementEnabled = true;
		this.turningEnabled = true;

		this.visit(this.position);
	}

	selectRandomTarget() {
		const neighbors = this.game.level.grid.getNeighbors(this.position);
		this.setTarget(Pixies.randomElement(neighbors));
	}

	visit(position) {
		if (this.lastVisited) this.game.level.grid.chessboard.removeVisitor(this.lastVisited, this.model);
		this.lastVisited = position.clone();
		this.game.level.grid.chessboard.addVisitor(position, this.model);
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
		//this.game.level.grid.chessboard.removeVisitor(this.position, this.model);
		//if (this.target) this.game.level.grid.chessboard.removeVisitor(this.target, this.model);
		this.position.set(position);
		//this.game.level.grid.chessboard.addVisitor(this.position, this.model);
	}

	onClick(e) {

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
		}

	}

}
