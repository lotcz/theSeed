import SpriteControllerStrategy from "./SpriteControllerStrategy";
import HintController from "../controller/HintController";
import ImageModel from "../model/ImageModel";
import HintModel from "../model/HintModel";
import {IMAGE_POTASSIUM} from "../builder/SpriteStyle";

const HINT_TIMEOUT = 1000;
const HINT_DISTANCE = 4;

export default class JellymakerStrategy extends SpriteControllerStrategy {
	hintController;

	constructor(game, model, controls) {
		super(game, model, controls, HINT_TIMEOUT);

		this.movementEnabled = true;
		this.turningEnabled = true;
		this.scalingEnabled = false;

	}

	selectTargetInternal() {
		if (!this.hintController) {
			const hintModel = new HintModel();
			hintModel.position.set(this.model.position);
			hintModel.imagePath.set(IMAGE_POTASSIUM);
			this.hintController = new HintController(this.game, hintModel, this.controls);
			this.addChild(this.hintController);
			this.hintController.deactivate();
		}

		const beeDistance = this.model.position.distanceTo(this.level.bee.position);
		if (this.hintController.isActivated()) {
			if (beeDistance > (2 * HINT_DISTANCE)) {
				this.hintController.hide();
			} else {
				this.hintController.show();
			}
		} else {
			if (beeDistance < HINT_DISTANCE) {
				this.hintController.activate();
			}
		}
	}

}
