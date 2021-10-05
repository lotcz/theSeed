import ModelBase from "./ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export default class ImageModel extends ModelBase {
	coordinates;
	flipped;
	rotation;
	scale;
	path;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			coordinates: this.coordinates.toArray(),
			flipped: this.flipped.get(),
			rotation: this.rotation.get(),
			scale: this.scale.get(),
			path: this.path,
		}
	}

	restoreState(state) {
		this.coordinates = new Vector2(state.coordinates);
		this.addChild(this.coordinates);
		this.flipped = new DirtyValue(state.flipped);
		this.addChild(this.flipped);
		this.rotation = new RotationValue(state.rotation);
		this.addChild(this.rotation);
		this.scale = new DirtyValue(state.scale);
		this.addChild(this.scale);
		this.path = state.path;
	}

}
