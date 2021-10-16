import ImageModel from "./ImageModel";
import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import CollectionModel from "./CollectionModel";

export default class BeeModel extends ModelBase {
	direction;
	position;
	image;
	inventory;

	constructor(state) {
		super();

		this.inventory = new CollectionModel();
		this.addChild(this.inventory);

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
		if (state.inventory) this.inventory.restoreState(state.inventory);
	}

}
