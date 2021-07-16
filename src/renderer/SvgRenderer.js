import RendererBase from "./RendererBase";

export default class SvgRenderer extends RendererBase {
	draw;

	constructor(draw, model) {
		super(model);
		this.draw = draw;
	}

	setDraw(draw) {
		if (this.draw !== draw) {
			this.draw = draw;
			this.makeDirty();
		}
	}

}
