import ActivatedTree from "../class/ActivatedTree";

export default class ControllerBase extends ActivatedTree {
	game;
	model;
	controls;

	constructor(game, model, controls) {
		super();
		this.game = game;
		this.model = model;
		this.controls = controls;

	}

	update(delta) {
		if (this.model.isDeleted()) {
			this.setDeleted(true);
			return;
		}

		if (!this.isActivated()) {
			return;
		}

		this.children.forEach((c) => c.update(delta));
		this.updateInternal(delta);
	}

	updateInternal(delta) {

	}

}
