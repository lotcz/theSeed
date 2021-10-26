import ModelBase from "../class/ModelBase";

export default class HashTableModel extends ModelBase {
	keyValues;

	constructor(state, restoreFunc) {
		super();

		this.keyValues = [];

		if (state && restoreFunc) {
			this.restoreState(state, restoreFunc);
		}
	}

	get(key) {
		return this.keyValues[key];
	}

	exists(key) {
		return (this.keyValues[key] !== undefined);
	}

	add(key, element = null) {
		if (this.exists(key)) {
			console.log(`Key ${key} already exists in hash table, replacing value.`);
		}
		this.keyValues[key] = element;
		this.triggerEvent('add', key);
		return element;
	}

	set(key, element = null) {
		this.add(key, element);
	}

	remove(key) {
		const element = this.get(key);
		if (element === undefined) {
			console.log(`Key ${key} doesn't exist in hash table`);
			return;
		}
		this.keyValues.splice(key, 1);
		this.triggerEvent('remove', key);
		return element;
	}

	reset() {
		const keys = this.keys();
		keys.forEach((key) => this.remove(key));
	}

	count() {
		return this.keys().length;
	}

	keys() {
		return Object.keys(this.keyValues);
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
		for (let key in this.keyValues) {
			func(key, this.keyValues[key]);
		}
	}

	getState() {
		const state = {};
		this.forEach((key, element) => state[key] = (element === null) ? null : element.getState());
		return state;
	}

	restoreState(state, restoreFunc) {
		this.reset();
		for (let key in state) {
			this.add(key, restoreFunc(state[key]));
		}
	}

}
