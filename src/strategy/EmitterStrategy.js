import SpriteControllerStrategy from "./SpriteControllerStrategy";
import LevelBuilder from "../builder/LevelBuilder";

const EMITTER_TIMEOUT = 1000;

export default class EmitterStrategy extends SpriteControllerStrategy {
	max;
	emitted;

	constructor(game, model, controls) {
		super(game, model, controls, EMITTER_TIMEOUT);

		this.movementEnabled = false;
		this.turningEnabled = false;
		this.scalingEnabled = false;
		this.max = 10;
		this.emitted = 0;

		this.builder = new LevelBuilder(this.level);

		if (this.model.data.timeout) {
			this.defaultTimeout = this.model.data.timeout;
		}

		if (this.model.data.timeout) {
			this.max = this.model.data.max;
		}

	}

	selectTargetInternal() {
		if (this.max === -1 || this.emitted <= this.max) {
			this.emitted++;
			this.builder.addSpriteFromStyle(this.position, this.model.data.type);
		}
	}

}
