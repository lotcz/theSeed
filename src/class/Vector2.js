import Dirty from "./Dirty";

export default class Vector2 extends Dirty {
	x;
	y;

	constructor(x = 0, y = 0) {
		super();
		this.x = x;
		this.y = y;
	}

	distanceTo(v) {
		return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
	}

	equalsTo(v) {
		return this.x === v.x && this.y === v.y;
	}

	set(x, y) {
		if (y === undefined && typeof x === 'object') {
			this.set(x.x, x.y);
			return;
		}
		this.setX(x);
		this.setY(y);
	}

	setX(x) {
		if (this.x !== x) {
			this.x = x;
			this.makeDirty();
		}
	}

	setY(y) {
		if (this.y !== y) {
			this.y = y;
			this.makeDirty();
		}
	}

	size() {
		return this.distanceTo(new Vector2(0, 0));
	}

	add(v) {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	addX(x) {
		return new Vector2(this.x + x, this.y);
	}

	addY(y) {
		return new Vector2(this.x, this.y + y);
	}

	subtract(v) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	toArray() {
		return [this.x, this.y];
	}

	fromArray(arr) {
		if (typeof arr === 'object' && arr.length === 2) {
			this.setX(arr[0]);
			this.setY(arr[1]);
		}
	}
}
