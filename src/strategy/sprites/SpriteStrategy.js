import ControllerBase from "../../class/ControllerBase";

export default class SpriteStrategy extends ControllerBase {
	lastVisited;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.lastVisited = null;
	}

	activateInternal() {
		this.visit(this.model.position);
	}

	deactivateInternal() {
		if (this.lastVisited) this.chessboard.removeVisitor(this.lastVisited, this.model);
	}

	visit(position) {
		if (this.lastVisited) this.chessboard.removeVisitor(this.lastVisited, this.model);
		this.lastVisited = position.clone();
		this.chessboard.addVisitor(this.lastVisited, this.model);
	}

	setPosition(position) {
		this.model.position.set(position);
		this.visit(position);
	}

}
