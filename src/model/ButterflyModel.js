import ModelBase from "./ModelBase";
import Vector2 from "../class/Vector2";

export default class ButterflyModel extends ModelBase {
	position;

	constructor(state) {
		super(state);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			position: this.position.toArray()
		}
	}

	restoreState(state) {
		this.position = new Vector2(0, 0);
		this.position.fromArray(state.position);
	}
}
