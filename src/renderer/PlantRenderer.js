import SvgRenderer from "./SvgRenderer";
import LivingTreeRenderer from "./LivingTreeRenderer";

export default class PlantRenderer extends SvgRenderer {

	constructor(draw, model, grid) {
		super(draw, model);
		this.addChild(new LivingTreeRenderer(draw, model.roots, grid, false, 'brown', {width: 5, color: 'red'}));
		this.addChild(new LivingTreeRenderer(draw, model.stem, grid, true, 'lightGreen', {width: 5, color: '#0d0'}));
	}

}
