import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";

export default class BeeRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.group = this.draw.group().addClass('bee');

		this.imageRenderer = new ImageRenderer(game, this.model.image, this.group);
		this.addChild(this.imageRenderer);

		this.leftWingRenderer = new ImageRenderer(game, this.model.leftWing, this.group);
		this.addChild(this.leftWingRenderer);

		this.rightWingRenderer = new ImageRenderer(game, this.model.rightWing, this.group);
		this.addChild(this.rightWingRenderer);

	}

	activateInternal() {
		this.updateFlip();
	}

	renderInternal() {
		if (this.model.image.flipped.isDirty()) {
			this.updateFlip();
		}
	}

	updateFlip() {
		if (this.model.image.flipped.get()) {
			this.leftWingRenderer.group.back();
			this.rightWingRenderer.group.front();
		} else {
			this.leftWingRenderer.group.front();
			this.rightWingRenderer.group.back();
		}
	}

}
