import ControllerBase from "./ControllerBase";
import SpriteController from "./SpriteController";

export default class SpriteCollectionController extends ControllerBase {
	constructor(grid, model, controls) {
		super(grid, model, controls);

		this.controllers = [];
		this.model.children.forEach((m) => this.addController(m));
		this.model.clean();
	}

	addController(model) {
		this.controllers.push(new SpriteController(this.grid, model, this.controls));
	}

	update(delta) {
		this.model.added.forEach((a) => this.addController(a));
		this.model.clean();

		this.controllers.forEach((c) => c.update(delta));
	}

}
