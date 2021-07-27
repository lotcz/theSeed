import MovementStrategy from "./MovementStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const WATER_TIMEOUT = 3000;

export default class WaterStrategy extends MovementStrategy {
	sprite;

	constructor(game, model, controls) {
		super(game, model.image, controls, WATER_TIMEOUT);

		this.sprite = model;
	}

	selectTargetInternal() {

		if (Math.random() < 0.99) return;

		const down = this.game.level.grid.getNeighborDown(this.position);
		if (!this.game.level.isValidPosition(down)) {
			this.game.level.sprites.remove(this.sprite);
		}
		this.setTarget(down);

	}

}
