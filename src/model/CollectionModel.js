import ModelBase from "./ModelBase";

export default class CollectionModel extends ModelBase {
	on_remove;
	on_add ;

	constructor() {
		super();

		this.on_remove = [];
		this.on_add = [];
	}

	getState() {
		return this.getChildrenState();
	}

	restoreState(state, restoreFunc) {
		const children = state.map(restoreFunc);
		children.forEach((ch) => this.add(ch));
	}

	add(element) {
		this.addChild(element);
		this.on_add.forEach((a) => a(element));
	}

	remove(element) {
		this.removeChild(element);
		this.on_remove.forEach((r) => r(element));
	}

	addOnRemoveListener(listener) {
		this.on_remove.push(listener);
	}

	removeOnRemoveListener(listener) {
		this.on_remove.splice(this.on_remove.indexOf(listener), 1);
	}

	addOnAddListener(listener) {
		this.on_add.push(listener);
	}

	removeOnAddListener(listener) {
		this.on_add.splice(this.on_add.indexOf(listener), 1);
	}

}
