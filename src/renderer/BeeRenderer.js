import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";

export default class BeeRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.imageRenderer = new ImageRenderer(game, this.model.image, this.draw);
		this.addChild(this.imageRenderer);

		this.leftWingRenderer = new ImageRenderer(game, this.model.leftWing, this.draw);
		this.addChild(this.leftWingRenderer);

		this.rightWingRenderer = new ImageRenderer(game, this.model.rightWing, this.draw);
		this.addChild(this.rightWingRenderer);

	}

}
