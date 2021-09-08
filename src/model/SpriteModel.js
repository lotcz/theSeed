import ModelBase from "./ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";

export default class SpriteModel extends ModelBase {
	image;
	strategy;
	data;
	_is_sprite;
	onClick;

	constructor(state) {
		super();

		this._is_sprite = true;

		if (state) {
			this.restoreState(state);
		}

	}

	getState() {
		return {
			image: this.image.getState(),
			strategy: this.strategy.get(),
			data: this.data
		}
	}

	restoreState(state) {
		this.image = new ImageModel(state.image);
		this.addChild(this.image);
		this.strategy = new DirtyValue(state.strategy);
		this.addChild(this.strategy);
		this.data = state.data;
	}

}
