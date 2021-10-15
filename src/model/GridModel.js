import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import Chessboard from "../class/Chessboard";

const NEIGHBOR_VECTOR_UP = new Vector2(0, -1);
const NEIGHBOR_VECTOR_DOWN = new Vector2(0, 1);
const NEIGHBOR_VECTOR_LEFT = new Vector2(-1, 0);
const NEIGHBOR_VECTOR_RIGHT = new Vector2(1, 0);

export const NEIGHBOR_UP = 0;
export const NEIGHBOR_UPPER_RIGHT = 1;
export const NEIGHBOR_LOWER_RIGHT = 2;
export const NEIGHBOR_DOWN = 3;
export const NEIGHBOR_LOWER_LEFT = 4;
export const NEIGHBOR_UPPER_LEFT = 5;

export const CORNER_RIGHT = 0;
export const CORNER_LOWER_RIGHT = 1;
export const CORNER_LOWER_LEFT = 2;
export const CORNER_LEFT = 3;
export const CORNER_UPPER_LEFT = 4;
export const CORNER_UPPER_RIGHT = 5;

export default class GridModel extends ModelBase {
	size;
	scale;
	tileSize;
	chessboard;

	constructor(state) {
		super();
		this.chessboard = new Chessboard();
		if (state) this.restoreState(state);
	}

	getCoordinates(position) {
		const offset = (position.x % 2) === 0 ? 0 : this.tileSize.y / 2;
		return new Vector2(position.x * this.tileSize.x * 3/4, offset + (position.y * this.tileSize.y));
	}

	getMaxCoordinates() {
		const maxPos = this.getMaxPosition();
		return new Vector2(maxPos.x * this.tileSize.x * 3/4, maxPos.y * this.tileSize.y);
	}

	getPosition(coordinates) {
		const x = Math.round(coordinates.x / (this.tileSize.x * 3/4));
		const offset = (x % 2) === 0 ? 0 : this.tileSize.y / 2;
		const y = Math.round((coordinates.y - offset) / this.tileSize.y)
		return new Vector2(x, y);
	}

	getMaxPosition() {
		return this.size.subtract(new Vector2(1, 1));
	}

	getCorners(position) {
		const corners = [];
		const coordinates = this.getCoordinates(position);
		for (let i = 0, max = 6; i < max; i++) {
			corners.push(this.getCornerFromCoordinates(coordinates, i));
		}
		return corners;
	}

	getCornerFromCoordinates(coordinates, i) {
		const angle_rad = (Math.PI/3 * i);
		return new Vector2(coordinates.x + this.scale * Math.cos(angle_rad), coordinates.y + this.scale * Math.sin(angle_rad));
	}

	getCorner(position, i) {
		return this.getCornerFromCoordinates(this.getCoordinates(position), i);
	}

	getNeighbor(position, direction, steps = 1) {
		switch (direction) {
			case NEIGHBOR_UP:
				return this.getNeighborUp(position, steps);
			case NEIGHBOR_UPPER_RIGHT:
				return this.getNeighborUpperRight(position, steps);
			case NEIGHBOR_LOWER_RIGHT:
				return this.getNeighborLowerRight(position, steps);
			case NEIGHBOR_DOWN:
				return this.getNeighborDown(position, steps);
			case NEIGHBOR_LOWER_LEFT:
				return this.getNeighborLowerLeft(position, steps);
			case NEIGHBOR_UPPER_LEFT:
				return this.getNeighborUpperLeft(position, steps);
		};
	}

	getNeighbors(position) {
		return [
			this.getNeighborUp(position),
			this.getNeighborUpperRight(position),
			this.getNeighborLowerRight(position),
			this.getNeighborDown(position),
			this.getNeighborLowerLeft(position),
			this.getNeighborUpperLeft(position)
		];
	}

	getNeighborUp(position, steps = 1) {
		return position.add(NEIGHBOR_VECTOR_UP.multiply(steps));
	}

	getNeighborDown(position, steps = 1) {
		return position.add(NEIGHBOR_VECTOR_DOWN.multiply(steps));
	}

	getNeighborUpperLeft(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_LEFT.addY(-1) : NEIGHBOR_VECTOR_LEFT);
		if (steps > 1) {
			return this.getNeighborUpperLeft(result, steps - 1);
		} else {
			return result;
		}
	}

	getNeighborUpperRight(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_RIGHT.addY(-1) : NEIGHBOR_VECTOR_RIGHT);
		if (steps > 1) {
			return this.getNeighborUpperRight(result, steps - 1);
		} else {
			return result;
		}
	}

	getNeighborLowerLeft(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_LEFT : NEIGHBOR_VECTOR_LEFT.addY(1));
		if (steps > 1) {
			return this.getNeighborLowerLeft(result, steps - 1);
		} else {
			return result;
		}
	}

	getNeighborLowerRight(position, steps = 1) {
		const result = position.add(position.x % 2 === 0 ? NEIGHBOR_VECTOR_RIGHT : NEIGHBOR_VECTOR_RIGHT.addY(1));
		if (steps > 1) {
			return this.getNeighborLowerRight(result, steps - 1);
		} else {
			return result;
		}
	}

	isValidPosition(position) {
		return position.x > 0 && position.x < this.size.x && position.y > 0 && position.y < this.size.y;
	}

	getValidNeighbors(position) {
		const neighbors = this.getNeighbors(position);
		return neighbors.filter((n) => this.isValidPosition(n));
	}

	getState() {
		return {
			size: this.size.toArray(),
			scale: this.scale
		}
	}

	restoreState(state) {
		this.size = Vector2.fromArray(state.size);
		this.scale = state.scale;
		this.tileSize = new Vector2(2 * this.scale, Math.sqrt(3) * this.scale);
	}

}


