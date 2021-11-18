import ModelBase from "../class/ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";

export default class SpriteModel extends ModelBase {
	position;
	image;
	attachedSprite;
	strategy;
	data;
	type;
	_is_sprite;
	_is_penetrable;
	_is_crawlable;
	onClick;

	constructor(state) {
		super();

		// for visitor to be recognized as sprite
		this._is_sprite = true;
		this._is_penetrable = true;
		this._is_crawlable = false;

		this.image = null;

		this.attachedSprite = new DirtyValue(null);
		this.addChild(this.attachedSprite);

		this.position = new Vector2();
		this.addChild(this.position);
		this.strategy = new DirtyValue();
		this.addChild(this.strategy);

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
			attachedSprite: (this.attachedSprite) ? this.attachedSprite.getState() : null,
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
		if (state.attachedSprite) {
			this.attachedSprite.set(new SpriteModel(state.attachedSprite));
		}
		if (state.strategy) this.strategy.restoreState(state.strategy);
		if (state.data) this.data = state.data;
		if (state.type) this.type = state.type;
	}

}
