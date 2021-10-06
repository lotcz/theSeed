import SvgRenderer from "./SvgRenderer";
import SpriteRenderer from "./SpriteRenderer";

export default class SpriteCollectionRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.model.children.forEach((m) => this.addRenderer(m));
		this.model.addOnAddListener((sender, param) => this.addRenderer(param));
		this.model.addOnRemoveListener((sender, param) => this.removeRenderer(param));
	}

	addRenderer(model) {
		const renderer = new SpriteRenderer(this.game, model, this.draw);
		model._renderer = renderer;
		this.addChild(renderer);
		if (this.isActivated()) {
			renderer.activate();
		}
	}

	removeRenderer(model) {
		const renderer = model._renderer;
		renderer.deactivate();
		this.removeChild(renderer);
	}

	updateOuttaSight() {
		this.children.forEach((r) => r.updateOuttaSight());
	}

}
