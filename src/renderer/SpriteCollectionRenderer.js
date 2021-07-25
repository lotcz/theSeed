import SvgRenderer from "./SvgRenderer";
import SpriteRenderer from "./SpriteRenderer";

export default class SpriteCollectionRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.model.children.forEach((m) => this.addRenderer(m));
		this.model.addOnAddListener((a) => this.addRenderer(a));
		this.model.addOnRemoveListener((a) => this.removeRenderer(a));
	}

	addRenderer(model) {
		const renderer = new SpriteRenderer(this.game, model, this.draw);
		model._renderer = renderer;
		this.addChild(renderer);
	}

	removeRenderer(model) {
		const renderer = model._renderer;
		renderer.deactivate();
		this.removeChild(renderer);
	}

}
