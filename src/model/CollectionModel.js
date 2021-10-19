import ModelBase from "../class/ModelBase";

export default class CollectionModel extends ModelBase {
	constructor(state, restoreFunc) {
		super();

		if (state && restoreFunc) {
			this.restoreState(state, restoreFunc);
		}
	}

	getState() {
		return this.getChildrenState();
	}

	restoreState(state, restoreFunc) {
		this.reset();
		const children = state.map(restoreFunc);
		children.forEach((ch) => this.add(ch));
	}

	add(element) {
		this.addChild(element);
		this.triggerEvent('add', element);
		return element;
	}

	remove(element) {
		const child = this.removeChild(element);
		if (child) this.triggerEvent('remove', child);
		return child;
	}

	reset() {
		while (this.children.length > 0) {
			this.remove(this.children[0]);
		}
	}

	count() {
		return this.children.length;
	}

	removeFirst() {
		if (this.count() > 0) {
			return this.remove(this.children[0]);
		}
	}

	addOnRemoveListener(listener) {
		this.addEventListener('remove', listener);
	}

	removeOnRemoveListener(listener) {
		this.removeEventListener('remove', listener);
	}

	addOnAddListener(listener) {
		this.addEventListener('add', listener);
	}

	removeOnAddListener(listener) {
		this.removeEventListener('add', listener);
	}

	forEach(func) {
		this.children.forEach(func);
	}

}
