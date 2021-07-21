import Tree from "../class/Tree";

export default class RendererBase extends Tree {
	game;
	model;
	grid;

	constructor(game, model) {
		super();
		this.game = game;
		this.model = model;
		this.grid = this.game.level.grid;
	}

	activate() {

	}

	deactivate() {

	}

	render() {
		if (this.isDirty() || this.model.isDirty()) {
			this.renderInternal();
			this.renderChildren();
			this.clean();
			this.model.clean();
		}
	}

	renderChildren() {
		for (let i = 0, max = this.children.length; i < max; i++) {
			const child = this.children[i];
			child.render();
		}
	}

	renderInternal() {
		// override this method
	}

}
