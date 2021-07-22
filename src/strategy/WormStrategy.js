import MovementStrategy from "./MovementStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const WORM_TIMEOUT = 1500;

export default class WormStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model.image, controls, WORM_TIMEOUT);

	}

	selectTargetInternal() {
		const neighbors = this.game.level.grid.getValidNeighbors(this.position);
		const groundNeighbors = neighbors.filter((n) => this.game.level.isUnderGround(n));
		if (groundNeighbors.length > 0) {
			this.setTarget(Pixies.randomElement(groundNeighbors));
		}
	}

}
