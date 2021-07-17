import SvgRenderer from "./SvgRenderer";
import ButterflyImage from '../../res/img/butterfly.svg';

export default class ButterflyRenderer extends SvgRenderer {
	grid;
	group;

	constructor(draw, model, grid) {
		super(draw, model);

		this.grid = grid;
		this.group = this.draw.image(ButterflyImage);
	}

	renderInternal() {
		const coords = this.grid.getCoordinates(this.model.position);
		console.log(coords);
		this.group.move(coords.x, coords.y);
	}

}
