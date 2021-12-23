import ModelBase from "../class/ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";
import Pixies from "../class/Pixies";

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
		this.attachedSpriteBehind = false;

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
			attachedSprite: (this.attachedSprite.isSet()) ? this.attachedSprite.get().getState() : null,
			strategy: this.strategy.get(),
			data: Pixies.clone(this.data),
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
		if (this.data.penetrable !== undefined) this._is_penetrable = this.data.penetrable;
		if (this.data.crawlable !== undefined) this._is_crawlable = this.data.crawlable;
		if (state.type) this.type = state.type;
	}

	clone() {
		const state = this.getState();
		const sprite = new SpriteModel(state);
		sprite.isPersistent = this.isPersistent;
		sprite._is_penetrable = this._is_penetrable;
		sprite._is_crawlable = this._is_crawlable;
		return sprite;
	}

}
