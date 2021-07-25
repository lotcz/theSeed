import ActivatedTree from "../class/ActivatedTree";

export default class RendererBase extends ActivatedTree {
	game;
	model;
	grid;

	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;
		this.grid = this.game.level.grid;
	}

	render() {
		if (this.model.isDeleted()) {
			this.setDeleted(true);
			return;
		}

		if (!this.isActivated()) {
			return;
		}

		if (this.isDirty() || this.model.isDirty()) {
			this.renderInternal();
			this.children.forEach((r) => r.render());
			this.clean();
			this.model.clean();
		}
	}

	renderInternal() {

	}

}
