import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const WATER_TIMEOUT = 3000;

export default class WaterStrategy extends SpriteControllerStrategy {

	constructor(game, model, controls) {
		super(game, model, controls, WATER_TIMEOUT);

		this.turningEnabled = false;
	}

	selectTargetInternal() {

		if (Math.random() < 0.9) return;

		const down = this.game.level.grid.getNeighborDown(this.position);
		if (!this.game.level.isValidPosition(down)) {
			this.game.level.sprites.remove(this.model);
		}
		this.setTarget(down);

	}

}
