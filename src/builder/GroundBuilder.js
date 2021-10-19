import GroundModel from "../model/GroundModel";
import Pixies from "../class/Pixies";
import {GROUND_TYPE_BASIC} from "./GroundStyle";

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
		const max = this.grid.getMaxPosition();
		let position = start.clone();
		this.points.push(position);
		let vertPos = position.clone();
		vertPos.setY(max.y - 1);
		this.points.push(vertPos);

		while (position.x < (max.x - 1)) {
			position = Math.random() < preset.right.up ? this.grid.getNeighborUpperRight(position) : this.grid.getNeighborLowerRight(position);
			this.points.push(position);

			let vertPos = position.clone();
			vertPos.setY(max.y - 1);
			this.points.push(vertPos);
		}

		vertPos = position.clone();
		while (vertPos.y < max.y) {
			vertPos = vertPos.addY(1);
			this.points.push(vertPos);
		}

		position = start.clone();
		while (position.x > 0) {
			position = Math.random() < preset.left.up ? this.grid.getNeighborUpperLeft(position) : this.grid.getNeighborLowerLeft(position);
			this.points.unshift(position);

			let vertPos = position.clone();
			vertPos.setY(max.y - 1);
			this.points.push(vertPos);
		}

		vertPos = position.clone();
		while (vertPos.y < max.y) {
			vertPos = vertPos.addY(1);
			this.points.push(vertPos);
		}
	}

	generateRandom(start) {
		const preset = Pixies.randomElement(PRESETS);
		this.generateFromPreset(start, preset);
	}

	build() {
		const ground = new GroundModel();
		this.points.forEach((p) => {
			ground.addTile({
				position: p.getState(),
				type: GROUND_TYPE_BASIC
			})
		});
		return ground;
	}

}
