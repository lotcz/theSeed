import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";

export default class SpriteRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.imageRenderer = new ImageRenderer(game, model.image, draw);
		this.addChild(this.imageRenderer);

		if (model.onClick) {
			this.imageRenderer.setOnClick(model.onClick);
		}
	}

	render() {
		this.imageRenderer.render();
	}

}
