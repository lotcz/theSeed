import ModelBase from "./ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";

export default class SpriteModel extends ModelBase {
	position;
	image;
	strategy;
	data;
	_is_sprite;
	onClick;

	constructor(state) {
		super();

		// for visitor to be recognized as sprite
		this._is_sprite = true;

		this.data = {};

		if (state) {
			this.restoreState(state);
		}

	}

	getState() {
		return {
			position: this.position.toArray(),
			image: this.image.getState(),
			strategy: this.strategy.get(),
			data: this.data
		}
	}

	restoreState(state) {
		this.position = Vector2.fromArray(state.position);
		this.addChild(this.position);
		if (state.image) {
			this.image = new ImageModel(state.image);
			this.addChild(this.image);
		}
		this.strategy = new DirtyValue(state.strategy);
		this.addChild(this.strategy);
		if (state.data) {
			this.data = state.data;
		}
	}

}
