import ImageModel from "./ImageModel";
import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import CollectionModel from "./CollectionModel";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";
import AnimationModel from "./AnimationModel";

export default class BeeModel extends ModelBase {
	position;
	coordinates;
	direction; // vector of movement
	rotation;
	crawling; // null or neighbor type
	headingLeft; // if false, then bee is heading right
	inventory;
	health;
	image;
	crawlingAnimation;
	leftWing;
	rightWing;

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
		this.headingLeft = new DirtyValue(false);
		this.addChild(this.headingLeft);
		this.inventory = new CollectionModel();
		this.addChild(this.inventory);
		this.health = new DirtyValue(1);
		this.addChild(this.health);

		this.image = new ImageModel();
		this.addChild(this.image);
		this.crawlingAnimation = new AnimationModel();
		this.addChild(this.crawlingAnimation);
		this.leftWing = new ImageModel();
		this.addChild(this.leftWing);
		this.rightWing = new ImageModel();
		this.addChild(this.rightWing);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			position: this.position.getState(),
			direction: this.direction.getState(),
			rotation: this.rotation.getState(),
			crawling: this.crawling.getState(),
			headingLeft: this.headingLeft.getState(),
			inventory: this.inventory.getState(),
			health: this.health.getState(),
			image: this.image.getState(),
			crawlingAnimation: this.crawlingAnimation.getState(),
			leftWing: this.leftWing.getState(),
			rightWing: this.rightWing.getState(),

		}
	}

	restoreState(state) {
		if (state.position) this.position.restoreState(state.position);
		if (state.direction) this.direction.restoreState(state.direction);
		if (state.rotation) this.rotation.restoreState(state.rotation);
		if (state.crawling) this.crawling.restoreState(state.crawling);
		if (state.headingLeft) this.headingLeft.restoreState(state.headingLeft);
		if (state.inventory) this.inventory.restoreState(state.inventory);
		if (state.health) this.health.restoreState(state.health);
		if (state.image) this.image.restoreState(state.image);
		if (state.crawlingAnimation) this.crawlingAnimation.restoreState(state.crawlingAnimation);
		if (state.leftWing) this.leftWing.restoreState(state.leftWing);
		if (state.rightWing) this.rightWing.restoreState(state.rightWing);
	}

	isFlying() {
		return this.crawling.isEmpty();
	}

	isCrawling() {
		return !this.isFlying();
	}

}
