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
	type;
	_is_sprite;
	_is_penetrable;
	onClick;

	constructor(state) {
		super();

		// for visitor to be recognized as sprite
		this._is_sprite = true;
		this._is_penetrable = true;

		this.position = new Vector2();
		this.addChild(this.position);
		this.strategy = new DirtyValue();
		this.addChild(this.strategy);
		this.oriented = new DirtyValue(false);
		this.addChild(this.oriented);

		this.type = '';
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
			data: this.data,
			type: this.type
		}
	}

	restoreState(state) {
		if (state.position) this.position.restoreState(state.position);
		if (state.image) {
			if (this.image) this.removeChild(this.image);
			this.image = new ImageModel(state.image);
			this.addChild(this.image);
		}
		if (state.strategy) this.strategy.restoreState(state.strategy);
		if (state.data) this.data = state.data;
		if (state.oriented) this.oriented.restoreState(state.oriented);
		if (state.type) this.type = state.type;
	}

}
