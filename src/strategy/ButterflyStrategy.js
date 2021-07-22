import MovementStrategy from "./MovementStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const BUTTERFLY_TIMEOUT = 300;

export default class ButterflyStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model.image, controls, BUTTERFLY_TIMEOUT);

		const max = this.game.level.grid.getMaxPosition();
		this.setPosition(new Vector2(Pixies.randomIndex(max.x + 1), Pixies.randomIndex(max.y + 1)));
	}

}
