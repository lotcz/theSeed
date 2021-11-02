import SpriteControllerStrategy from "./SpriteControllerStrategy";
import HintController from "../controller/HintController";
import ImageModel from "../model/ImageModel";
import HintModel from "../model/HintModel";
import {IMAGE_POTASSIUM} from "../builder/SpriteStyle";

const HINT_TIMEOUT = 1000;

export default class HintStrategy extends SpriteControllerStrategy {
	start;

	constructor(game, model, controls) {
		super(game, model, controls, HINT_TIMEOUT);

		this.movementEnabled = true;
		this.turningEnabled = false;
		this.scalingEnabled = true;
	}

	activateInternal() {
		super.activateInternal();

		this.start = this.position.clone();
		this.timeout = 0;
	}

	selectTargetInternal() {
		if (this.model.data.isHiding) {
			if (this.position.equalsTo(this.start)) {
				this.model.triggerEvent('hidden');
			} else {
				this.setTarget(this.start);
				this.targetScale = 0.01;
			}
		} else {
			if (this.model.data.targetPosition) {
				this.setTarget(this.model.data.targetPosition);
			}
			if (this.model.data.targetScale) {
				this.targetScale = this.model.data.targetScale;
			} else {
				this.targetScale = 2;
			}
		}
	}

}
