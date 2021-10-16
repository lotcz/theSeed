import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import {GROUND_STYLES, GROUND_TYPE_BASIC} from "../builder/GroundStyle";

export default class GroundTileModel extends ModelBase {
	position;
	type;
	_is_ground;
	_is_penetrable;

	constructor(state) {
		super();

		// for visitor to be recognized as ground
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
		if (GROUND_STYLES[this.type].background === true) {
			this._is_penetrable = true;
		}
	}

}
