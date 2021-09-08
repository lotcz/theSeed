import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import SpriteBuilder, {IMAGE_WATER, IMAGE_WORM_BODY, IMAGE_WORM_BUTT} from "../builder/SpriteBuilder";
import {STRATEGY_WATER, STRATEGY_WORM} from "../controller/SpriteController";

const MINERAL_UNIT_SIZE = 0.1;

export default class MineralStrategy extends SpriteControllerStrategy {
	insideUp;

	constructor(game, model, controls) {
		super(game, model, controls, 10000);


	}



	selectTargetInternal() {

		//this.setTarget(down);

	}

	updateInternal(delta) {
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI))
		this.model.image.scale.set(scale * 2);
	}

}
