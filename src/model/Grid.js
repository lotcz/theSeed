import Vector2 from "../class/Vector2";

export default class Grid {
	size;
	scale;

	constructor(size, scale) {
		this.size = size;
		this.scale = scale;
	}

	getCoordinates(position) {
		return new Vector2(position.x * this.scale.x, position.y * this.scale.y);
	}

	getBox(position) {
		return { x: (position.x - 0.5) * this.scale.x, y: (position.y - 0.5) * this.scale.y, w: this.scale.x, h: this.scale.y};
	}

	getPosition(coordinates) {
		return new Vector2(Math.round(coordinates.x / this.scale.x), Math.round(coordinates.y / this.scale.y));
	}

}


