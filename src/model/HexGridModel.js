import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";

const NEIGHBOR_UP = new Vector2(0, -1);
const NEIGHBOR_DOWN = new Vector2(0, 1);
const NEIGHBOR_LEFT = new Vector2(-1, 0);
const NEIGHBOR_RIGHT = new Vector2(1, 0);

export default class HexGridModel extends ModelBase {
	size;
	scale;
	tileSize;

	constructor(state) {
		super();
		if (state) this.restoreState(state);
	}

	getCoordinates(position) {
		const offset = (position.x % 2) === 0 ? 0 : this.tileSize.y / 2;
		return new Vector2(position.x * this.tileSize.x * 3/4, offset + (position.y * this.tileSize.y));
	}

	getMaxCoordinates() {
		return new Vector2(this.size.x * this.tileSize.x * 3/4, this.size.y * this.tileSize.y);
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
			corners.push(this.pointCorner(coordinates, i));
		}
		return corners;
	}

	pointCorner(center, i) {
		const angle_rad = (Math.PI/3 * i);
		return new Vector2(center.x + this.scale * Math.cos(angle_rad), center.y + this.scale * Math.sin(angle_rad));
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

	getNeighborUp(position) {
		return position.add(NEIGHBOR_UP);
	}

	getNeighborDown(position) {
		return position.add(NEIGHBOR_DOWN);
	}

	getNeighborUpperLeft(position) {
		return position.add(position.x % 2 === 0 ? NEIGHBOR_LEFT.addY(-1) : NEIGHBOR_LEFT);
	}

	getNeighborUpperRight(position) {
		return position.add(position.x % 2 === 0 ? NEIGHBOR_RIGHT.addY(-1) : NEIGHBOR_RIGHT);
	}

	getNeighborLowerLeft(position) {
		return position.add(position.x % 2 === 0 ? NEIGHBOR_LEFT : NEIGHBOR_LEFT.addY(1));
	}

	getNeighborLowerRight(position) {
		return position.add(position.x % 2 === 0 ? NEIGHBOR_RIGHT : NEIGHBOR_RIGHT.addY(1));
	}

	getState() {
		return {
			size: this.size.toArray(),
			scale: this.scale
		}
	}

	restoreState(state) {
		this.size = new Vector2();
		this.size.fromArray(state.size);
		this.scale = state.scale;
		this.tileSize = new Vector2(2 * this.scale, Math.sqrt(3) * this.scale);
	}

}


