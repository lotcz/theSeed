import DirtyValue from "./DirtyValue";

export default class RotationValue extends DirtyValue {
	value;

	constructor(value) {
		super();
		if (value !== undefined) this.set(value);
	}

	static normalizeValue(value) {
		let result = value % 360;
		if (result > 180) {
			result = result - 360;
		}
		if (result < -180) {
			result = result + 360;
		}
		return result;
	}

	set(value) {
		const normalized = RotationValue.normalizeValue(value);
		if (this.value !== normalized) {
			this.value = normalized;
			this.makeDirty();
		}
	}

	add(value) {
		this.set(this.get() + value);
	}

	equalsTo(value) {
		return (this.value === RotationValue.normalizeValue(value));
	}

	clone() {
		return new RotationValue(this.value);
	}

}
