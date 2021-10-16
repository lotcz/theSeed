import ControllerBase from "../class/ControllerBase";
import SpriteController from "./SpriteController";

export default class SpriteCollectionController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model.children.forEach((m) => this.addController(m));
		this.model.addOnAddListener((sender, param) => this.addController(param));
		this.model.addOnRemoveListener((sender, param) => this.removeController(param));
	}

	addController(model) {
		console.log('adding controller');
		const controller = new SpriteController(this.game, model, this.controls);
		model._controller = controller;
		this.addChild(controller);
		if (this.isActivated()) {
			controller.activate();
		}
	}

	removeController(model) {
		this.removeChild(model._controller);
	}

}
