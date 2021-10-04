import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";

export default class BeeRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.imageRenderer = new ImageRenderer(game, model.image, draw);
		this.addChild(this.imageRenderer);

	}

	renderInternal() {
		console.log('rendering bee');
	}
}
