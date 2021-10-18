import ImageModel from "./ImageModel";
import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import CollectionModel from "./CollectionModel";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export default class BeeModel extends ModelBase {
	position;
	coordinates;
	direction; // vector of movement
	rotation;
	crawling; // null or neighbor type
	image;
	imageCrawl;
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
		this.rotation = new RotationValue(0);
		this.addChild(this.rotation);
		this.crawling = new DirtyValue(null);
		this.addChild(this.crawling);
		this.image = new ImageModel();
		this.addChild(this.image);
		this.imageCrawl = new ImageModel();
		this.addChild(this.imageCrawl);
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
			rotation: this.rotation.getState(),
			image: this.image.getState(),
			imageCrawl: this.imageCrawl.getState(),
			crawling: this.crawling.get(),
			leftWing: this.leftWing.getState(),
			rightWing: this.rightWing.getState(),
			inventory: this.inventory.getState(),
		}
	}

	restoreState(state) {
		if (state.position) this.position.restoreState(state.position);
		if (state.direction) this.direction.restoreState(state.direction);
		if (state.rotation) this.rotation.restoreState(state.rotation);
		if (state.crawling) this.crawling.set(state.direction);
		if (state.image) this.image.restoreState(state.image);
		if (state.imageCrawl) this.imageCrawl.restoreState(state.imageCrawl);
		if (state.leftWing) this.leftWing.restoreState(state.leftWing);
		if (state.rightWing) this.rightWing.restoreState(state.rightWing);
		if (state.inventory) this.inventory.restoreState(state.inventory);
	}

	isFlying() {
		return this.crawling.isEmpty();
	}

	isCrawling() {
		return !this.isFlying();
	}

}
