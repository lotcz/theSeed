import SvgRenderer from "./SvgRenderer";
import LivingTreeRenderer, {CURVES_STANDARD, CURVES_WAVY} from "./LivingTreeRenderer";

export default class PlantRenderer extends SvgRenderer {

	constructor(draw, model, grid) {
		super(draw, model);
		this.addChild(new LivingTreeRenderer(draw, model.roots, grid, false, 'brown', {width: 5, color: 'red'}, CURVES_STANDARD));
		this.addChild(new LivingTreeRenderer(draw, model.stem, grid, true, 'lightGreen', {width: 5, color: '#0d0'}, CURVES_WAVY));
	}

}
