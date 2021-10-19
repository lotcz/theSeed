import ControllerBase from "../class/ControllerBase";

export default class GroundController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.model.tiles.addOnAddListener((param) => this.addVisitor(param));
		this.model.tiles.addOnRemoveListener((param) => this.removeVisitor(param));
	}

	addVisitor(tile) {
		this.chessboard.addVisitor(tile.position, tile);
	}

	removeVisitor(tile) {
		this.chessboard.removeVisitor(tile.position, tile);
	}

	activateInternal() {
		this.model.tiles.forEach((tile) => this.addVisitor(tile));
	}

	deactivateInternal() {
		this.model.tiles.forEach((tile) => this.removeVisitor(tile));
	}

}
