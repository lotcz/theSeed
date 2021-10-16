import ImageModel from "./ImageModel";
import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";
import InventoryModel from "./InventoryModel";

export default class BeeModel extends ModelBase {
	direction;
	position;
	image;
	inventory;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			position: this.position.toArray(),
			direction: this.direction.toArray(),
			image: this.image.getState(),
			inventory: this.inventory.getState(),
		}
	}

	restoreState(state) {
		this.resetChildren();
		this.position = Vector2.fromArray(state.position);
		this.addChild(this.position);
		this.direction = Vector2.fromArray(state.direction);
		this.addChild(this.direction);
		this.image = new ImageModel(state.image);
		this.addChild(this.image);
		this.inventory = new InventoryModel(state.inventory);
		this.addChild(this.inventory);
	}

}
