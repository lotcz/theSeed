import ModelBase from "./ModelBase";
import ParallaxLayerModel from "./ParallaxLayerModel";
import CollectionModel from "./CollectionModel";
import Vector2 from "../class/Vector2";

export default class ParallaxModel extends ModelBase {
	layers;
	cameraOffset;

	constructor(state) {
		super(state);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.layers = new CollectionModel(state.layers, (s) => new ParallaxLayerModel(s));
		this.addChild(this.layers);
		this.cameraOffset = new Vector2(state.cameraOffset);
		this.addChild(this.cameraOffset);
	}

	getState() {
		return {
			layers: this.layers.getState(),
			cameraOffset: this.cameraOffset.toArray()
		}
	}

}
