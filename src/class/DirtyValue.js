import Tree from "./Tree";

export default class DirtyValue extends Tree {
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
