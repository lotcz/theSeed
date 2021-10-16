import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const RESPAWN_TIMEOUT = 1000;

export default class RespawnStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, RESPAWN_TIMEOUT);

		this.movementEnabled = false;
		this.turningEnabled = false;
		this.scalingEnabled = false;
	}

}
