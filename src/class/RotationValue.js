import Tree from "./Tree";
import DirtyValue from "./DirtyValue";

export default class RotationValue extends DirtyValue {
	value;

	constructor(value) {
		super();
		this.value = value;
	}

	static normalizeValue(value) {
		let result = value % 360;
		if (result > 180) {
			result = - 180 + (result - 180);
		}
		if (result < -180) {
			result = 180 + result + 180;
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

}
