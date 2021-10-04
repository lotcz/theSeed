import GroundModel from "../model/GroundModel";

export const GROUND_PRESET_HILL = {
	left: {
		up: 0.2
	},
	right: {
		up: 0.2
	}
};

export const GROUND_PRESET_VALLEY = {
	left: {
		up: 0.9
	},
	right: {
		up: 0.9
	}
};

export const GROUND_PRESET_SLOPE_LEFT = {
	left: {
		up: 0.2
	},
	right: {
		up: 0.8
	}
};

export const GROUND_PRESET_SLOPE_RIGHT = {
	left: {
		up: 0.8
	},
	right: {
		up: 0.2
	}
};

const PRESETS = [
	GROUND_PRESET_HILL,
	GROUND_PRESET_VALLEY,
	GROUND_PRESET_SLOPE_LEFT,
	GROUND_PRESET_SLOPE_RIGHT
];

export default class GroundBuilder {
	grid;
	points;

	constructor(grid) {
		this.grid = grid;
		this.points = [];
	}

	generateFromPreset(start, preset) {
		let position = start.clone();

		this.points.push(position);

		while (position.x < (this.grid.size.x - 1)) {
			position = Math.random() < preset.right.up ? this.grid.getNeighborUpperRight(position) : this.grid.getNeighborLowerRight(position);
			this.points.push(position);
		}

		position = start.clone();
		while (position.x > 0) {
			position = Math.random() < preset.left.up ? this.grid.getNeighborUpperLeft(position) : this.grid.getNeighborLowerLeft(position);
			this.points.unshift(position);
		}

	}

	generateRandom(start) {
		const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
		this.generateFromPreset(start, preset);
	}

	build() {
		const ground = new GroundModel();
		ground.points = this.points;
		return ground;
	}

}