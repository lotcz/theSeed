import Dirty from "./Dirty";
import Tree from "./Tree";

export default class Vector2 extends Tree {
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
		return (v) ? this.x === v.x && this.y === v.y : false;
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

	multiply(s) {
		return new Vector2(this.x * s, this.y * s);
	}

	subtract(v) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	toArray() {
		return [this.x, this.y];
	}

	setFromArray(arr) {
		if (typeof arr === 'object' && arr.length === 2) {
			this.setX(arr[0]);
			this.setY(arr[1]);
		}
	}

	static fromArray(arr) {
		const v = new Vector2();
		v.setFromArray(arr);
		return v;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	/***
	 * Return angle between AB and Y axis
	 * @param target
	 * @returns {number}
	 */
	getAngleToY(b) {
		const diff = this.subtract(b);
		const left = diff.x > 0;
		const down = diff.y < 0;
		const sinX = diff.x / diff.size();
		const x = Math.asin(sinX);
		const angle = -x * 180 / Math.PI;
		return down ? left ? (-90 - (90 + angle)) : (90 + (90 - angle)) : angle;
	}

}
