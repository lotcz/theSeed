import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import {STRATEGY_RESPAWN} from "../controller/SpriteController";

const RESPAWN_TIMEOUT = 1000;

export default class ExitStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, RESPAWN_TIMEOUT);

		this.movementEnabled = false;
		this.turningEnabled = false;

		this.respawn = this.level.sprites.children.find((sprite) => sprite.strategy.get() === STRATEGY_RESPAWN);
	}

	selectTargetInternal() {
		if (this.model.position.distanceTo(this.level.bee.position) < 5) {
			console.log('Exit');
			if (!this.respawn) {
				console.log('No respawn location');
				return;
			}
			this.level.bee.position.set(this.respawn.position);
			this.level.bee.image.coordinates.set(this.grid.getCoordinates(this.respawn.position));

		}
		//const visitors = this.chessboard.getVisitors(this.position)
	}

}
