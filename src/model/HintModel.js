import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";

export default class HintModel extends ModelBase {
	position;
	imagePath;

	constructor(state) {
		super();

		this.position = new Vector2();
		this.addChild(this.position);

		this.imagePath = new DirtyValue();
		this.addChild(this.imagePath);

		if (state) {
			this.restoreState(state);
		}
	}

}
