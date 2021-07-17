import SvgRenderer from "./SvgRenderer";
import Vector2 from "../class/Vector2";

export default class GroundRenderer extends SvgRenderer {
	path;
	fill;
	stroke;
	group;

	constructor(draw, model, grid, fill, stroke) {
		super(draw, model);
		this.fill = fill;
		this.stroke = stroke;
		this.grid = grid;
		this.group = null;
	}

	renderInternal() {
		if (this.group) this.group.remove();
		this.group = this.draw.group();
		const points = this.model.points.map((p) => this.grid.getCoordinates(p));
		this.path = `M${points[0].x} ${points[0].y} S `;
		for (let i = 1, max = points.length; i < max; i++) {
			this.path += `${points[i].x} ${points[i].y} `;
		}

		const gridSize = this.grid.getMaxCoordinates();
		this.path += `L 0 ${gridSize.y} `;
		this.path += `L ${gridSize.x} ${gridSize.y} Z`;

		const path = this.group.path(this.path).stroke(this.stroke).fill(this.fill);
		path.back();
	}

}
