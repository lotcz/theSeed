import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import SpriteRenderer from "./SpriteRenderer";

export default class SpriteCollectionRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.model.children.forEach((m) => this.addRenderer(m));
	}

	addRenderer(model) {
		const renderer = new SpriteRenderer(this.game, model, this.draw);
		model._renderer = renderer;
		this.addChild(renderer);
	}

	render() {
		this.renderChildren();
	}

}
