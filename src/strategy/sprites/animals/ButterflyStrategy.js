import MovementStrategy from "../MovementStrategy";
import Pixies from "../../../class/Pixies";

const BUTTERFLY_TIMEOUT = 300;

export default class ButterflyStrategy extends MovementStrategy {
	lastDirection;

	constructor(game, model, controls) {
		super(game, model, controls, BUTTERFLY_TIMEOUT);

		this.lastDirection = null;
		this.model._is_penetrable = false;
	}

	updateStrategy() {
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
