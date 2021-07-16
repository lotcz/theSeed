import Dirty from "./Dirty";

export default class Tree extends Dirty {
	children;
	parent;

	constructor() {
		super();
		this.parent = null;
		this.children = [];
	}

	makeDirty() {
		this.is_dirty = true;
		if (!this.isRoot()) {
			this.parent.makeDirty();
		}
	}

	isRoot() {
		return (this.parent === null);
	}

	findRoot() {
		return (this.isRoot()) ? this : this.parent.findRoot();
	}

	addChild(node) {
		node.parent = this;
		this.children.push(node);
		return node;
	}

	forEach(func) {
		func(this);
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			func(child);
		}
	}

}
