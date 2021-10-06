import Tree from "../class/Tree";
import EventManager from "../class/EventManager";

export default class ModelBase extends Tree {
	eventManager;

	constructor(state) {
		super();

		this.eventManager = new EventManager();
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

	addEventListener(eventName, eventHandler) {
		this.eventManager.addEventListener(eventName, eventHandler);
	}

	removeEventListener(eventName, eventHandler) {
		this.eventManager.removeEventListener(eventName, eventHandler);
	}

	triggerEvent(eventName, param) {
		this.eventManager.triggerEvent(eventName, this, param);
	}

}
