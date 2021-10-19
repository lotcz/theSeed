import ControllerBase from "../class/ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";
import BeeController from "./BeeController";
import GroundController from "./GroundController";

export default class LevelController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.groundController = new GroundController(game, model.ground, controls);
		this.addChild(this.groundController);

		/*
		if (model.plant.auto) {
			this.plantController = new AutoPlantController(game, model.plant, controls);
		} else {
			this.plantController = new PlantController(game, model.plant, controls);
		}
		this.addChild(this.plantController);
*/

		this.spritesController = new SpriteCollectionController(game, model.sprites, controls);
		this.addChild(this.spritesController);

		if (model.bee) {
			this.beeController = new BeeController(game, model.bee, controls);
			this.addChild(this.beeController);
		}

	}

}
