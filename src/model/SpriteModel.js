import ModelBase from "./ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";

export const STRATEGY_BUG = 0;

export default class SpriteModel extends ModelBase {
	image;
	strategy;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			image: this.image.getState(),
			strategy: this.strategy.get()
		}
	}

	restoreState(state) {
		this.image = new ImageModel(state.image);
		this.addChild(this.image);
		this.strategy = new DirtyValue(state.strategy);
		this.addChild(this.strategy);
	}

}
