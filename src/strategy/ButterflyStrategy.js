import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const BUTTERFLY_TIMEOUT = 300;

export default class ButterflyStrategy extends SpriteControllerStrategy {
	lastDirection;

	constructor(game, model, controls) {
		super(game, model, controls, BUTTERFLY_TIMEOUT);

		this.lastDirection = null;
	}

	selectTargetInternal() {
		const neighbors = this.level.grid.getNeighbors(this.position);

		if (this.lastDirection && (Math.random() < 0.95)) {
			const next = neighbors[this.lastDirection];
			if (this.level.isAir(next)) {
				this.setTarget(next);
				return;
			}
		}

		const validNeighbors = neighbors.filter((n) => this.level.isPenetrable(n));
		if (validNeighbors.length > 0) {
			const next = Pixies.randomElement(validNeighbors);
			this.lastDirection = neighbors.indexOf(next);
			this.setTarget(next);
		}
	}

}
