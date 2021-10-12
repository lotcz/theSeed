import ModelBase from "../model/ModelBase";

export default class DirtyValue extends ModelBase {
	value;

	constructor(value) {
		super();
		this.value = value;
	}

	addOnChangeListener(eventHandler) {
		this.addEventListener('change', eventHandler);
	}

	set(value) {
		if (this.value !== value) {
			this.value = value;
			this.makeDirty();
			this.triggerEvent('change', value);
		}
	}

	get() {
		return this.value;
	}

	isEmpty() {
		return this.value === null || this.value === undefined;
	}

}
