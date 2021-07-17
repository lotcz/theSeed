import SvgRenderer from "./SvgRenderer";
import RootsRenderer from "./RootsRenderer";
import StemRenderer from "./StemRenderer";

export default class PlantRenderer extends SvgRenderer {

	constructor(draw, model, grid) {
		super(draw, model);
		this.addChild(new RootsRenderer(draw, model.roots, grid));
		this.addChild(new StemRenderer(draw, model.stem, grid));
	}

}
