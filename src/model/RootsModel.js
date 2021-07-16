import LivingTree from "./LivingTree";
import Vector2 from "../class/Vector2";

export default class RootsModel extends LivingTree {

	constructor(position) {
		super(position);
	}

	restoreState(state) {
		let n = this.addChild(new RootsModel(new Vector2(this.position.x, this.position.y + 1)));
		let r = n.addChild(new RootsModel(new Vector2(this.position.x + 1, this.position.y + 2)));
		r = r.addChild(new RootsModel(new Vector2(this.position.x + 2, this.position.y + 3)));
		n = n.addChild(new RootsModel(new Vector2(this.position.x - 1, this.position.y + 2)));
		n.addChild(new RootsModel(new Vector2(this.position.x , this.position.y + 3)));
		n.addChild(new RootsModel(new Vector2(this.position.x - 2, this.position.y + 3)));
	}

	getState() {
		return {
			position: {
				x: this.tree.position.x,
				y: this.tree.position.y,
			}
		}
	}

	addRoot(parent, position) {
		parent.addChild(new RootsModel(position));
	}

}
