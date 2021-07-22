import MovementStrategy from "./MovementStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const WORM_TIMEOUT = 1500;

export default class WormStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model.image, controls, WORM_TIMEOUT);

		const max = this.game.level.grid.getMaxPosition();
		this.setPosition(new Vector2(Pixies.randomIndex(max.x + 1), Pixies.randomIndex(max.y + 1)));
	}



}
