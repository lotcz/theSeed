import LivingTree from "./LivingTree";
import Vector2 from "../class/Vector2";

export default class StemModel extends LivingTree {

	constructor(position) {
		super(position);
	}

	restoreState(state) {
		let n = this.addChild(new StemModel(new Vector2(this.position.x, this.position.y - 1)));
		let r = n.addChild(new StemModel(new Vector2(this.position.x + 1, this.position.y - 2)));
		r = r.addChild(new StemModel(new Vector2(this.position.x + 2, this.position.y - 3)));
		n = n.addChild(new StemModel(new Vector2(this.position.x - 1, this.position.y - 2)));
		n.addChild(new StemModel(new Vector2(this.position.x , this.position.y - 3)));
		n.addChild(new StemModel(new Vector2(this.position.x - 2, this.position.y - 3)));
	}

	addStem(parent, position) {
		parent.addChild(new StemModel(position));
	}

}
