import ModelBase from "../class/ModelBase";
import ParallaxLayerModel from "./ParallaxLayerModel";
import CollectionModel from "./CollectionModel";
import Vector2 from "../class/Vector2";

export default class ParallaxModel extends ModelBase {
	layers;
	cameraOffset;

	constructor(state) {
		super(state);

		this.layers = new CollectionModel();
		this.addChild(this.layers);

		this.cameraOffset = new Vector2();
		this.addChild(this.cameraOffset);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		if (state.layers) this.layers.restoreState(state.layers, (s) => new ParallaxLayerModel(s));
		if (state.cameraOffset) this.cameraOffset.restoreState(state.cameraOffset);
	}

	getState() {
		return {
			layers: this.layers.getState(),
			cameraOffset: this.cameraOffset.toArray()
		}
	}

}
