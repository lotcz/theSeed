import ModelBase from "../class/ModelBase";
import ImageModel from "./ImageModel";

export default class ParallaxLayerModel extends ModelBase {
	distance; // 0 - front, 1 - infinity
	image;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			distance: this.distance,
			image: this.image.getState()
		}
	}

	restoreState(state) {
		this.distance = state.distance;
		this.image = new ImageModel(state.image);
		this.addChild(this.image);
	}

}
