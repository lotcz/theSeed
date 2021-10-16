import ActivatedTree from "./ActivatedTree";

export default class ControllerBase extends ActivatedTree {
	game;
	model;
	controls;
	level;
	grid;
	chessboard;

	constructor(game, model, controls) {
		super();
		this.game = game;
		this.model = model;
		this.controls = controls;

		this.level = game.level.get();
		if (this.level) {
			this.grid = this.level.grid;
			this.chessboard = this.level.grid.chessboard;
		}

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
