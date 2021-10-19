import ControllerBase from "../class/ControllerBase";
import {BEE_CENTER} from "../controller/BeeController";
import {NEIGHBOR_TYPE_LOWER_LEFT, NEIGHBOR_TYPE_UPPER_LEFT} from "../model/GridModel";
import Vector2 from "../class/Vector2";

export default class BeeCrawlStrategy extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

	}

	activateInternal() {
		this.updateBee();
	}

	updateInternal(delta) {


	}

	updateBee() {
		this.model.imageCrawl.coordinates.set(BEE_CENTER);
		const rotation = (60 * (this.model.crawling.get() - 3));
		const left = this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT;
		this.model.imageCrawl.rotation.set(rotation);
		this.model.imageCrawl.flipped.set(left);
		this.model.leftWing.rotation.set(rotation - 10);
		this.model.leftWing.flipped.set(left);
		this.model.rightWing.rotation.set(rotation - 20);
		this.model.rightWing.flipped.set(left);
	}

}
