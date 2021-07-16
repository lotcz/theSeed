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

export class Vector2 {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distanceTo(v) {
		return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}

	size() {
		return this.distanceTo(new Vector2(0, 0));
	}

	subtract(v) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}
}
