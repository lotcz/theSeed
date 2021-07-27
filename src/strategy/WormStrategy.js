import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const WORM_TIMEOUT = 1500;

export default class WormStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, WORM_TIMEOUT);

	}

	selectTargetInternal() {
		const neighbors = this.game.level.grid.getValidNeighbors(this.position);
		const groundNeighbors = neighbors.filter((n) => this.game.level.isUnderGround(n));
		if (groundNeighbors.length > 0) {
			const position = Pixies.randomElement(groundNeighbors);
			const visitors = this.game.level.grid.chessboard.getTile(position);
			if (visitors.length === 0) {
				this.setTarget(position);
			}
		}
	}

}
