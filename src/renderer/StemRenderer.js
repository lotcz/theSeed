import LivingTreeRenderer from "./LivingTreeRenderer";

export default class StemRenderer extends LivingTreeRenderer {

	constructor(draw, model, grid) {
		super(draw, model, grid, true, 'lightGreen', {width: 5, color: '#0d0'});
	}


}
