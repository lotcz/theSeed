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
		this.points = state.points.map((p) => { const v = new Vector2(); v.fromArray(p); return v; });
	}

	getState() {
		return {
			points: this.points.map((p) => p.toArray())
		}
	}

	generateRandom(grid, start) {
		this.points = [];

		let position = start.clone();
		this.points.push(position);
		while (position.x > 0) {
			position = Math.random() > 0.5 ? grid.getNeighborUpperLeft(position) : grid.getNeighborLowerLeft(position);
			this.points.push(position);
		}

		position = start.clone();
		while (position.x < grid.size.x) {
			position = Math.random() > 0.5 ? grid.getNeighborUpperRight(position) : grid.getNeighborLowerRight(position);
			this.points.unshift(position);
		}

	}

}
