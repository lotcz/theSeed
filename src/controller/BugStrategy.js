import MovementStrategy from "./MovementStrategy";
import Random from "../class/Random";

const BUG_TIMEOUT = 500;

export default class BugStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, model.image.position, model.image.coordinates, BUG_TIMEOUT);

		this.gi = Random.randomIndex(this.game.level.ground.points.length);
		this.setPosition(this.game.level.ground.points[this.gi]);
		this.direction = 1;
	}

	selectTargetInternal() {
		if (Math.random() < 0.8) {
			this.direction = ((Math.random() < 0.1) ? -this.direction : this.direction);
			this.gi = Math.max(0, Math.min(this.game.level.ground.points.length - 1, this.gi + this.direction));
			this.setTarget(this.game.level.ground.points[this.gi]);
		}
	}

	updateInternal(delta) {
		if (this.target && !this.position.equalsTo(this.target)) {
			this.model.image.rotation.set(this.position.getAngleToY(this.target));
		} else {
			this.model.image.rotation.set(0);
		}
	}

}
