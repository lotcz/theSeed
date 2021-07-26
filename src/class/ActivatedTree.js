import Tree from "./Tree";

export default class ActivatedTree extends Tree {
	activated;

	constructor(activated) {
		super();
		this.activated = (activated > 0);
	}

	isActivated() {
		return this.activated;
	}

	activate() {
		this.children.forEach((c) => c.activate());
		this.activated = true;
		this.activateInternal();
	}

	activateInternal() {

	}

	deactivate() {
		this.children.forEach((c) => c.deactivate());
		this.activated = false;
		this.deactivateInternal();
	}

	deactivateInternal() {

	}

	removeChild(node) {
		node.deactivate();
		return super.removeChild(node);
	}

}
