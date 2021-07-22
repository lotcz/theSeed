import MovementStrategy from "./MovementStrategy";
import Pixies from "../class/Pixies";

const BUG_TIMEOUT = 500;

export default class BugStrategy extends MovementStrategy {
	direction;

	constructor(game, model, controls) {
		super(game, model.image, controls, BUG_TIMEOUT);

		this.gi = Pixies.randomIndex(this.game.level.ground.points.length);
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


}
