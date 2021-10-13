import ModelBase from "./ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";

export const GROUND_TYPE_DELETE = '--delete--';
export const GROUND_TYPE_BASIC = 'basic';
export const GROUND_TYPE_WOOD = 'ground';
export const GROUND_TYPE_ROCK = 'rock';
export const GROUND_TYPE_GRASS = 'grass';
export const GROUND_TYPE_HONEY = 'honey';
export const GROUND_TYPE_WAX = 'wax';
export const GROUND_TYPE_WATER = 'water';

export default class GroundTileModel extends ModelBase {
	position;
	type;
	_is_ground;
	_is_penetrable;

	constructor(state) {
		super();

		this._is_ground = true;
		this._is_penetrable = false;

		if (state) {
			this.restoreState(state);
		}

	}

	getState() {
		return {
			position: this.position.toArray(),
			type: this.type
		}
	}

	restoreState(state) {
		this.position = Vector2.fromArray(state.position);
		this.addChild(this.position);
		this.type = state.type || GROUND_TYPE_BASIC;
	}

}
