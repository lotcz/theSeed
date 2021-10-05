import ImageModel from "./ImageModel";
import ModelBase from "./ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export default class BeeModel extends ModelBase {
	direction;
	position;
	image;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			position: this.position.toArray(),
			speed: this.speed.get(),
			direction: this.direction.toArray(),
			image: this.image.getState()
		}
	}

	restoreState(state) {
		this.resetChildren();
		this.position = Vector2.fromArray(state.position);
		this.addChild(this.position);
		this.speed = Vector2.fromArray(state.position);
		this.addChild(this.speed);
		this.direction = Vector2.fromArray(state.direction);
		this.addChild(this.direction);
		this.image = new ImageModel(state.image);
		this.addChild(this.image);
	}

}
