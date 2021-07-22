import ModelBase from "./ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export default class ImageModel extends ModelBase {
	position;
	coordinates;
	flipped;
	rotation;
	path;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			position: this.position.toArray(),
			coordinates: this.coordinates.toArray(),
			flipped: this.flipped.get(),
			rotation: this.rotation.get(),
			scale: this.scale.get(),
			path: this.path,
		}
	}

	restoreState(state) {
		this.position = Vector2.fromArray(state.position);
		this.addChild(this.position);
		this.coordinates = Vector2.fromArray(state.coordinates);
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
