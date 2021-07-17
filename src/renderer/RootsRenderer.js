import LivingTreeRenderer from "./LivingTreeRenderer";

export default class RootsRenderer extends LivingTreeRenderer {

	constructor(draw, model, grid) {
		super(draw, model, grid, false, 'brown', {width: 5, color: 'red'});
	}

}
