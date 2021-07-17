import Tree from "../class/Tree";

export default class ModelBase extends Tree {

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	/***
	 * Override this.
	 * @param state
	 */
	restoreState(state) {
		// restore state
	}

	/***
	 * Override this.
	 * @param state
	 * @param restoreFunc (state) => return Node
	 */
	restoreChildren(state, restoreFunc) {
		this.children = [];
		for (let i = 0, max = state.length; i < max; i++) {
			this.addChild(restoreFunc(state[i]));
		}
	}

	/***
	* Override this.
	* @param state
	*/
	getState() {
		return null;
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
