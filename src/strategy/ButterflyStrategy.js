import MovementStrategy from "./MovementStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const BUTTERFLY_TIMEOUT = 300;

export default class ButterflyStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model.image, controls, BUTTERFLY_TIMEOUT);

	}

	selectTargetInternal() {
		const neighbors = this.game.level.grid.getValidNeighbors(this.position);
		const airNeighbors = neighbors.filter((n) => this.game.level.isAboveGround(n));
		if (airNeighbors.length > 0) {
			this.setTarget(Pixies.randomElement(airNeighbors));
		}
	}

}
