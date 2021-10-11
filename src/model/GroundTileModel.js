import ModelBase from "./ModelBase";
import ImageModel from "./ImageModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";

export const GROUND_TYPE_EMPTY = '--empty--';
export const GROUND_TYPE_BASIC = 'rock';

export default class GroundTileModel extends ModelBase {
	position;
	type;
	_is_ground;

	constructor(state) {
		super();

		this._is_ground = true;

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
