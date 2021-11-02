import Tree from "./Tree";
import EventManager from "./EventManager";

export default class ModelBase extends Tree {
	constructor(state) {
		super();

		this.children = [];

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.restoreChildren(state);
	}

	restoreChildren(state, restoreFunc) {
		this.children = [];
		for (let i = 0, max = state.length; i < max; i++) {
			this.addChild(restoreFunc(state[i]));
		}
	}

	getState() {
		return {children: this.getChildrenState()};
	}

	getChildrenState() {
		if (this.children.length === 0) return null;
		const children = [];
		for (let i = 0, max = this.children.length; i < max; i++) {
			children.push(this.children[i].getState());
		}
		return children;
	}

}
