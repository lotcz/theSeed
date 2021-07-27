import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";

const BUG_TIMEOUT = 500;

export default class BugStrategy extends SpriteControllerStrategy {
	direction;

	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);

		if (!this.model.data) this.model.data = {};
		if (!this.model.data.gi) this.model.data.gi = Pixies.randomIndex(this.game.level.ground.points.length);
		this.setPosition(this.game.level.ground.points[this.model.data.gi]);
		this.direction = 1;
	}

	selectTargetInternal() {
		if (Math.random() < 0.8) {
			this.direction = ((Math.random() < 0.1) ? -this.direction : this.direction);
			const gi = Math.max(0, Math.min(this.game.level.ground.points.length - 1, this.model.data.gi + this.direction));
			const position = this.game.level.ground.points[gi];
			const visitors = this.game.level.grid.chessboard.getTile(position);
			if (visitors.length === 0) {
				this.model.data.gi = gi
				this.setTarget(position);
			}
		}
	}

}
