import ActivatedTree from "../class/ActivatedTree";

export default class RendererBase extends ActivatedTree {
	game;
	model;

	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;
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
