import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";

export default class SpriteRenderer extends SvgRenderer {
	grid;

	constructor(draw, model, grid) {
		super(draw, model);

		this.grid = grid;
		this.addChild(new ImageRenderer(draw, model.image, grid));

	}

}
