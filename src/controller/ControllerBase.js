import Tree from "../class/Tree";

export default class ControllerBase extends Tree {
	game;
	model;
	controls;

	constructor(game, model, controls) {
		super();
		this.game = game;
		this.model = model;
		this.controls = controls;

	}

	activate() {

	}

	deactivate() {

	}

	update(delta) {

	}

}
