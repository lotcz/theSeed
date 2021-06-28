import Grid, {Vector2} from "./Grid";

export default class Tree {
	root;

	constructor(root) {
		this.root = root;
	}

	findNodeOnPos(position) {
		return this.root.findNodeOnPos(position);
	}

	findNodesCloseTo(position, distance) {
		return this.root.findNodesCloseTo(position, distance);
	}

}

export class TreeNode {
	children;
	position;
	parent;
	power;

	constructor(position) {
		this.position = position;
		this.parent = null;
		this.power = 1;
		this.children = [];
	}

	findRoot() {
		if (this.parent === null) return this;
		return this.parent.findRoot();
	}

	powerUpdateRequested() {
		const root = this.findRoot();
		root.updatePower();
	}

	updatePower() {
		let power = 1;
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			child.updatePower();
			power += child.power;
		}
		this.power = power;
	}

	addChild(node) {
		node.parent = this;
		this.children.push(node);
		this.children = this.children.sort((a, b) => a.position.x - b.position.x);
		this.powerUpdateRequested();
		return node;
	}

	findNodeOnPos(position) {
		if (this.position.distanceTo(position) == 0) return this;
		for (let i = 0, max = this.children.length; i < max; i++) {
			let result = this.children[i].findNodeOnPos(position);
			if (result) return result;
		}
		return null;
	}

	findNodesCloseTo(position, distance) {
		let result = [];
		if (this.position.distanceTo(position) < distance) result.push(this);
		for (let i = 0, max = this.children.length; i < max; i++) {
			let results = this.children[i].findNodesCloseTo(position, distance);
			if (results.length > 0)	result = result.concat(results);
		}
		return result;
	}

}
