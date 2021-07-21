import MovementStrategy from "./MovementStrategy";
import Random from "../class/Random";
import Vector2 from "../class/Vector2";

const BUTTERFLY_TIMEOUT = 500;

export default class ButterflyStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, model.image.position, model.image.coordinates, BUTTERFLY_TIMEOUT);

		const max = this.game.level.grid.getMaxPosition();
		this.setPosition(new Vector2(Random.randomIndex(max.x + 1), Random.randomIndex(max.y + 1)));
	}

	updateInternal(delta) {
		if (this.target && !this.position.equalsTo(this.target)) {
			this.model.image.rotation.set(this.position.getAngleToY(this.target));
		}
	}

}
