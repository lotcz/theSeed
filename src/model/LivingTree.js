import ModelBase from "./ModelBase";

export default class LivingTree extends ModelBase {
	position;
	power;

	constructor(position) {
		super();
		this.position = position;
		this.power = 1;
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
		if (this.power !== power) {
			this.power = power;
			this.makeDirty();
		}
	}

	addChild(node) {
		super.addChild(node);
		this.children = this.children.sort((a, b) => a.position.x - b.position.x);
		this.powerUpdateRequested();
		return node;
	}

	findNodeOnPos(position) {
		if (this.position.distanceTo(position) === 0) return this;
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
