import Pixies from "../../../class/Pixies";
import AnimatedStrategy from "../AnimatedStrategy";

const BUTTERFLY_TIMEOUT = 300;

export default class ButterflyStrategy extends AnimatedStrategy {
	lastDirection;

	constructor(game, model, controls) {
		super(game, model, controls, BUTTERFLY_TIMEOUT);

		this.turnWhenMoving = true;

		this.lastDirection = null;
		this.model._is_penetrable = false;
		this.turningDuration = 200;
	}

	updateStrategy() {
		this.model.activeAnimation.set('flying');

		const neighbors = this.level.grid.getNeighbors(this.model.position);

		if (this.lastDirection && (Math.random() < 0.95)) {
			const next = neighbors[this.lastDirection];
			if (this.level.isAir(next)) {
				this.setTargetPosition(next);
				return;
			}
		}

		const validNeighbors = neighbors.filter((n) => this.level.isPenetrable(n));
		if (validNeighbors.length > 0) {
			const next = Pixies.randomElement(validNeighbors);
			this.lastDirection = neighbors.indexOf(next);
			this.setTargetPosition(next);
		}
	}

}
