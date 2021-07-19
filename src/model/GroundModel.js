import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";

const PRESET_HILL = {
	left: {
		up: 0.2
	},
	right: {
		up: 0.2
	}
};

const PRESET_VALLEY = {
	left: {
		up: 0.9
	},
	right: {
		up: 0.9
	}
};

const PRESET_SLOPE_LEFT = {
	left: {
		up: 0.2
	},
	right: {
		up: 0.8
	}
};

const PRESET_SLOPE_RIGHT = {
	left: {
		up: 0.8
	},
	right: {
		up: 0.2
	}
};

const PRESETS = [
	PRESET_HILL,
	PRESET_VALLEY,
	PRESET_SLOPE_LEFT,
	PRESET_SLOPE_RIGHT
];

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

		const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];

		let position = start.clone();
		this.points.push(position);
		while (position.x > 0) {
			position = Math.random() < preset.left.up ? grid.getNeighborUpperLeft(position) : grid.getNeighborLowerLeft(position);
			this.points.push(position);
		}

		position = start.clone();
		while (position.x < grid.size.x) {
			position = Math.random() < preset.right.up ? grid.getNeighborUpperRight(position) : grid.getNeighborLowerRight(position);
			this.points.unshift(position);
		}
/*
		if (this.points.length % 2 === 0) {
			this.points.unshift(position);
		}
*/
	}

}
