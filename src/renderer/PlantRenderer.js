import SvgRenderer from "./SvgRenderer";
import LivingTreeRenderer, {CURVES_STANDARD, CURVES_WAVY} from "./LivingTreeRenderer";
import {BROWN_DARK, BROWN_LIGHT} from "./Palette";

export default class PlantRenderer extends SvgRenderer {

	constructor(draw, model, grid) {
		super(draw, model);
		this.addChild(new LivingTreeRenderer(draw, model.roots, grid, false, BROWN_LIGHT, {width: 5, color: BROWN_DARK}, CURVES_STANDARD));
		this.addChild(new LivingTreeRenderer(draw, model.stem, grid, true, '#326522', {width: 5, color: '#237823'}, CURVES_WAVY));
	}

}
