import Dirty from "./Dirty";

export default class Tree extends Dirty {
	children;
	parent;
	dirtyParent;

	constructor() {
		super();
		this.parent = null;
		this.children = [];
	}

	makeDirty() {
		this.is_dirty = true;
		if (this.dirtyParent) {
			this.dirtyParent.makeDirty();
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
		node.dirtyParent = this;
		this.children.push(node);
		this.makeDirty();
		return node;
	}

	removeChild(node) {
		const index = this.children.indexOf(node);
		if (index >= 0) {
			this.children = this.children.slice(0, index).concat(this.children.slice(index, this.children.length - index - 1));
			this.makeDirty();
			return node;
		}
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			const result = child.removeChild(node);
			if (result) {
				return result;
			}
		}
		return null;
	}

	forEach(func) {
		func(this);
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			func(child);
		}
	}

	resetChildren() {
		this.children = [];
	}

}
