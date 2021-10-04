import ImageModel from "./ImageModel";
import ModelBase from "./ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export default class BeeModel extends ModelBase {
	speed;
	direction;
	image;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			speed: this.speed.get(),
			direction: this.direction.get(),
			image: this.image.getState()
		}
	}

	restoreState(state) {
		this.resetChildren();
		this.speed = Vector2.fromArray(state.position);
		this.addChild(this.speed);
		this.direction = new RotationValue(state.direction);
		this.addChild(this.direction);
		this.image = new ImageModel(state.image);
		this.addChild(this.image);
	}

}
