import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import * as dat from 'dat.gui';

export default class BeeRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		model.image.size = this.grid.tileSize;
		this.imageRenderer = new ImageRenderer(game, model.image, draw);
		this.addChild(this.imageRenderer);
/*
		this.gui = new dat.GUI();
		this.gui.add(this.model.direction, 'x').listen();
		this.gui.add(this.model.direction, 'y').listen();
*/

	}

	activateInternal() {

	}

	renderInternal() {

	}
}
