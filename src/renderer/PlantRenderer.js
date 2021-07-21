import SvgRenderer from "./SvgRenderer";
import LivingTreeRenderer, {CURVES_STANDARD, CURVES_WAVY} from "./LivingTreeRenderer";
import {BROWN_DARK, BROWN_LIGHT, GREEN_DARK, GREEN_LIGHT} from "./Palette";

export default class PlantRenderer extends SvgRenderer {

	constructor(game, model, draw) {
		super(game, model, draw);
		this.addChild(new LivingTreeRenderer(game, model.roots, draw, false, BROWN_LIGHT, {width: 5, color: BROWN_DARK}, CURVES_STANDARD));
		this.addChild(new LivingTreeRenderer(game, model.stem, draw, true, GREEN_LIGHT, {width: 5, color: GREEN_DARK}, CURVES_WAVY));
	}

}
