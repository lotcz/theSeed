import ImageModel from "./ImageModel";
import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import CollectionModel from "./CollectionModel";

export default class BeeModel extends ModelBase {
	direction;
	position;
	coordinates;
	image;
	leftWing;
	rightWing;
	inventory;

	constructor(state) {
		super();

		this.position = new Vector2();
		this.addChild(this.position);
		this.coordinates = new Vector2();
		this.addChild(this.coordinates);
		this.direction = new Vector2();
		this.addChild(this.direction);
		this.image = new ImageModel();
		this.addChild(this.image);
		this.leftWing = new ImageModel();
		this.addChild(this.leftWing);
		this.rightWing = new ImageModel();
		this.addChild(this.rightWing);
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
			leftWing: this.leftWing.getState(),
			rightWing: this.rightWing.getState(),
			inventory: this.inventory.getState(),
		}
	}

	restoreState(state) {
		if (state.position) this.position.restoreState(state.position);
		if (state.direction) this.direction.restoreState(state.direction);
		if (state.image) this.image.restoreState(state.image);
		if (state.leftWing) this.leftWing.restoreState(state.leftWing);
		if (state.rightWing) this.rightWing.restoreState(state.rightWing);
		if (state.inventory) this.inventory.restoreState(state.inventory);
	}

}
