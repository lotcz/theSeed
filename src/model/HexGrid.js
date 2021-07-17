import Vector2 from "../class/Vector2";

export default class HexGrid {
	size;
	scale;
	tileSize;

	constructor(size, scale) {
		this.size = size;
		this.scale = scale;
		this.tileSize = new Vector2(2 * this.scale, Math.sqrt(3) * this.scale);
	}

	getCoordinates(position) {
		const offset = (position.x % 2) === 0 ? 0 : this.tileSize.y / 2;
		return new Vector2(position.x * this.tileSize.x * 3/4, offset + (position.y * this.tileSize.y));
	}

	getPosition(coordinates) {
		const x = Math.round(coordinates.x / (this.tileSize.x * 3/4));
		const offset = (x % 2) === 0 ? 0 : this.tileSize.y / 2;
		const y = Math.round((coordinates.y - offset) / this.tileSize.y)
		return new Vector2(x, y);
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

}


