import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export default class InventoryModel extends ModelBase {
	water;

	constructor(state) {
		super();

		this.water = new DirtyValue(0);
		this.addChild(this.water);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			water: this.water.get(),
		}
	}

	restoreState(state) {
		if (this.water) this.removeChild(this.water);
		this.water = new DirtyValue(state.water);
		this.addChild(this.water);
	}

}
