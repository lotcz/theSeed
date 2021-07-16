import Dirty from "./Dirty";

export default class DirtyValue extends Dirty {
	value;

	constructor(value) {
		super();
		this.value = value;
	}

	set(value) {
		if (this.value !== value) {
			this.value = value;
			this.makeDirty();
		}
	}

	get() {
		return this.value;
	}

}
