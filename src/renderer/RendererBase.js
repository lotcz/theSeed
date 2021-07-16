import Tree from "../class/Tree";

export default class RendererBase extends Tree {
	model;

	constructor(model) {
		super();
		this.model = model;
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
