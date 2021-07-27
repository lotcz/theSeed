import ModelBase from "./ModelBase";
import LivingTreeModel from "./LivingTreeModel";
import Vector2 from "../class/Vector2";

export default class ParallaxModel extends ModelBase {
	layers;
	cameraOffset;

	constructor(state) {
		super(state);

		this.cameraOffset = new Vector2();
		this.addChild(this.cameraOffset);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.layers = state.layers;
		this.makeDirty();
	}

	getState() {
		return {
			layers: this.layers,
		}
	}

}
