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

	activateInternal() {
		this.model.clipAmount.set(1);
	}

	updateInternal(delta) {
		if (this.beeController && this.beeController.isDeleted()) {
			this.removeChild(this.beeController);
			this.beeController = new BeeController(this.game, this.model.bee, this.controls);
			this.addChild(this.beeController);
			this.beeController.activate();
		}
		if (this.model.clipAmount.get() > 0) {
			this.model.clipCenter.set(this.model.bee.coordinates);
			this.model.clipAmount.set(Math.max(this.level.clipAmount.get() - (0.5 * delta / 1000), 0));
		}
	}

}
