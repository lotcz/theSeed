import SpriteControllerStrategy from "./SpriteControllerStrategy";
import LevelBuilder from "../builder/LevelBuilder";

const EMITTER_TIMEOUT = 1000;

export default class EmitterStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, EMITTER_TIMEOUT);

		this.movementEnabled = false;
		this.turningEnabled = false;
		this.scalingEnabled = false;

		this.builder = new LevelBuilder(this.level);
	}

	selectTargetInternal() {
		this.builder.addSpriteFromStyle(this.position, this.model.data.type);
	}

}
