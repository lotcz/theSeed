import ModelBase from "./ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";

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

	isDirty() {
		return this.position.isDirty() || this.coordinates.isDirty() || this.flipped.isDirty() || this.rotation.isDirty() || this.scale.isDirty();
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
		this.position = new Vector2();
		this.position.fromArray(state.position);
		this.coordinates = new Vector2();
		this.coordinates.fromArray(state.coordinates);
		this.flipped = new DirtyValue(state.flipped);
		this.rotation = new DirtyValue(state.rotation);
		this.scale = new DirtyValue(state.scale);
		this.path = state.path;
	}

}
