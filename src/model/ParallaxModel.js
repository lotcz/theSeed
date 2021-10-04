import ModelBase from "./ModelBase";
import LivingTreeModel from "./LivingTreeModel";
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
		this.layers = state.layers;
		this.cameraOffset = Vector2.fromArray(state.cameraOffset);
		this.addChild(this.cameraOffset);
		this.makeDirty();
	}

	getState() {
		return {
			layers: this.layers,
			cameraOffset: this.cameraOffset.toArray()
		}
	}

}
