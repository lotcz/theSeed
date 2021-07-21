import ControllerBase from "./ControllerBase";
import Random from "../class/Random";

export default class MovementStrategy extends ControllerBase {
	position;
	coordinates;
	defaultTimeout;
	timeout;
	target;

	constructor(game, model, controls, position, coordinates, timeout) {
		super(game, model, controls);

		this.position = position;
		this.target = null;
		this.coordinates = coordinates;
		this.defaultTimeout = timeout;
		this.timeout = this.defaultTimeout;
	}

	selectRandomTarget() {
		const neighbors = this.game.level.grid.getNeighbors(this.position);
		this.setTarget(Random.randomElement(neighbors));
	}

	setTarget(target) {
		this.target = target;
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
		if (this.timeout <= 0 || this.target === null) {
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
			const diff = b.subtract(a);
			const v = a.add(diff.multiply(progress));
			this.coordinates.set(v);
		}

	}

}
