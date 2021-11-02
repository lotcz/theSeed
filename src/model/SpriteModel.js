import ModelBase from "../class/ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";

export default class SpriteModel extends ModelBase {
	position;
	image;
	strategy;
	oriented;
	data;
	_is_sprite;
	_is_penetrable;
	onClick;

	constructor(state) {
		super();

		// for visitor to be recognized as sprite
		this._is_sprite = true;
		this._is_penetrable = true;

		this.oriented = new DirtyValue(false);
		this.addChild(this.oriented);

		this.data = {};

		if (state) {
			this.restoreState(state);
		}

	}

	getState() {
		return {
			position: this.position.toArray(),
			image: (this.image) ? this.image.getState() : null,
			oriented: this.oriented.get(),
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
		if (state.oriented) this.oriented.restoreState(state.oriented);
	}

}
