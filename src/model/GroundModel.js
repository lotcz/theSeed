import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";

export default class GroundModel extends ModelBase {
	points;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.points = state.points.map((p) => Vector2.fromArray(p));
	}

	getState() {
		return {
			points: this.points.map((p) => p.toArray())
		}
	}

}
