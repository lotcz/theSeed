import SpriteControllerStrategy from "./SpriteControllerStrategy";
import {STRATEGY_RESPAWN} from "../builder/SpriteStyle";

const RESPAWN_TIMEOUT = 1000;

export default class ExitStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, RESPAWN_TIMEOUT);

		this.movementEnabled = false;
		this.turningEnabled = false;
		this.scalingEnabled = false;
	}

	selectTargetInternal() {
		if (this.model.position.distanceTo(this.level.bee.position) < 3) {
			console.log('Exit');
			this.game.levelName.set(this.model.data.level);
		}
		//const visitors = this.chessboard.getVisitors(this.position)
	}

}
