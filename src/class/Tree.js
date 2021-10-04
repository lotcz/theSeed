import Dirty from "./Dirty";

export default class Tree extends Dirty {
	is_deleted;
	children;
	parent;
	dirtyParent;

	constructor() {
		super();
		this.parent = null;
		this.children = [];
		this.is_deleted = false;
	}

	isDeleted() {
		return this.is_deleted;
	}

	setDeleted(deleted) {
		if (this.is_deleted !== deleted) {
			this.is_deleted = deleted;
			this.makeDirty();
		}
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

	hasChildren() {
		return this.children.length > 0;
	}

	removeChild(node) {
		const index = this.children.indexOf(node);
		if (index >= 0) {
			this.children.splice(index, 1);
			node.setDeleted(true);
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

	resetChildren() {
		this.children.forEach((child) => child.setDeleted(true));
		this.children = [];
		this.makeDirty();
	}

	forEach(func) {
		func(this);
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			child.forEach(func);
		}
	}

}
