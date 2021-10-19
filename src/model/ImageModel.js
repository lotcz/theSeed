import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export default class ImageModel extends ModelBase {
	coordinates;
	flipped;
	rotation;
	scale;
	path;
	size;

	constructor(state) {
		super();

		this.coordinates = new Vector2();
		this.addChild(this.coordinates);
		this.flipped = new DirtyValue(false);
		this.addChild(this.flipped);
		this.rotation = new RotationValue(0);
		this.addChild(this.rotation);
		this.scale = new DirtyValue(1);
		this.addChild(this.scale);
		this.size = null;
		this.path = '';

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
			size: (this.size === null) ? null : this.size.toArray(),
			path: this.path,
		}
	}

	restoreState(state) {
		if (state.coordinates) this.coordinates.setFromArray(state.coordinates);
		if (state.flipped) this.flipped.set(state.flipped);
		if (state.rotation) this.rotation.set(state.rotation);
		if (state.scale) this.scale.set(state.scale);
		if (state.path) this.path = state.path;
		if (state.size) {
			this.size = Vector2.fromArray(state.size);
			this.addChild(this.size);
		}
	}

}
