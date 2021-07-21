import ModelBase from "../model/ModelBase";

export default class Collection extends ModelBase {
	added;
	removed;

	constructor() {
		super();

		this.added = [];
		this.removed = [];
	}

	getState() {
		return this.getChildrenState();
	}

	restoreState(state, restoreFunc) {
		const children = state.map(restoreFunc);
		children.forEach((ch) => this.add(ch));
	}

	add(element) {
		this.added.push(element);
		this.addChild(element);
	}

	remove(element) {
		this.removed.push(element);
		//this.addChild(element);
	}

	clean() {
		this.added = [];
		this.removed = [];
		super.clean();
	}

}
