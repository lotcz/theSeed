import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import SpriteRenderer from "./SpriteRenderer";

export default class SpriteCollectionRenderer extends SvgRenderer {
	constructor(draw, model, grid) {
		super(draw, model);

		this.grid = grid;

		this.model.children.forEach((m) => this.addRenderer(m));
	}

	addRenderer(model) {
		const renderer = new SpriteRenderer(this.draw, model ,this.grid);
		model._renderer = renderer;
		this.addChild(renderer);
	}

	render() {
		this.renderChildren();
	}

}
