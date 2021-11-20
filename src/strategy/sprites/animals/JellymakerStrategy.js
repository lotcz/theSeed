import HintController from "../../../controller/HintController";
import HintModel from "../../../model/HintModel";
import {IMAGE_POTASSIUM} from "../../../builder/SpriteStyle";
import StaticStrategy from "../StaticStrategy";

const HINT_TIMEOUT = 1000;
const HINT_DISTANCE = 1;

export default class JellymakerStrategy extends StaticStrategy {
	hintController;

	constructor(game, model, controls) {
		super(game, model, controls, HINT_TIMEOUT);

		this.model._is_penetrable = false;
		this.model._is_crawlable = true;
	}

	updateStrategy() {
		if (!this.hintController) {
			const hintModel = new HintModel();
			hintModel.position.set(this.model.position);
			hintModel.imagePaths = [IMAGE_POTASSIUM];
			if (this.model.data.hintDirection !== undefined) {
				hintModel.direction = this.model.data.hintDirection;
			}
			this.hintController = new HintController(this.game, hintModel, this.controls);
			this.addChild(this.hintController);
			this.hintController.activate();
		}

		if (this.level.isPlayable && this.level.bee) {
			const beeDistance = this.model.position.distanceTo(this.level.bee.position);
			if (this.hintController.isActivated()) {
				if (beeDistance > (3 * HINT_DISTANCE)) {
					this.hintController.hide();
				} else {
					this.hintController.show();
				}
			} else {
				if (beeDistance < HINT_DISTANCE) {
					this.hintController.show();
				}
			}
		}
	}

}
