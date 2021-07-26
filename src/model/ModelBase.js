import Tree from "../class/Tree";

export default class ModelBase extends Tree {
	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.children = [];
	}

	restoreChildren(state, restoreFunc) {
		this.children = [];
		for (let i = 0, max = state.length; i < max; i++) {
			this.addChild(restoreFunc(state[i]));
		}
	}

	static restoreArray(state, restoreFunc) {
		const children = [];
		for (let i = 0, max = state.length; i < max; i++) {
			children.push(restoreFunc(state[i]));
		}
		return children;
	}

	static getArrayState(arr) {
		const children = [];
		for (let i = 0, max = arr.length; i < max; i++) {
			children.push(arr[i].getState());
		}
		return children;
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
