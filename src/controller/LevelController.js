import ControllerBase from "../class/ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";
import BeeController from "./BeeController";
import GroundController from "./GroundController";

export default class LevelController extends ControllerBase {

	constructor(game, model, controls) {
		super(game, model, controls);

		this.groundController = new GroundController(game, model.ground, controls);
		this.addChild(this.groundController);

		this.spritesController = new SpriteCollectionController(game, model.sprites, controls);
		this.addChild(this.spritesController);

		if (model.bee) {
			this.beeController = new BeeController(game, model.bee, controls);
			this.addChild(this.beeController);
		}

	}

	updateInternal(delta) {
		if (this.beeController) {
			if (this.beeController.isDeleted()) {
				this.removeChild(this.beeController);
				console.log(this.model.bee);
				if (this.model.bee) {
					if (!this.model.bee.isDeleted()) {
						this.beeController = new BeeController(this.game, this.model.bee, this.controls);
						this.addChild(this.beeController);
						this.beeController.activate();
					}
				}
			}
		}
	}
}
