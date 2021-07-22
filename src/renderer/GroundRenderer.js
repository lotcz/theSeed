import SvgRenderer from "./SvgRenderer";
import {BROWN_DARK, GROUND_DARK} from "./Palette";

const DEBUG_GROUND = false;


export default class GroundRenderer extends SvgRenderer {
	path;
	fill;
	stroke;
	group;

	constructor(game, model, draw, fill, stroke) {
		super(game, model, draw);
		this.fill = fill;
		this.stroke = stroke;
		this.group = null;
	}

	renderGridTile(position) {
		const corners = this.grid
			.getCorners(position)
			.map((c) => [c.x, c.y]);
		corners.push(corners[0]);
		this.group.polyline(corners).fill(BROWN_DARK).stroke({width: 1, color: GROUND_DARK});
		const coordinates = this.grid.getCoordinates(position);
		this.group.circle(25).fill('red').center(coordinates.x, coordinates.y);
	}

	renderInternal() {
		if (this.group) this.group.remove();
		this.group = this.draw.group();

		if (DEBUG_GROUND) {
			for (let i = 0, max = this.model.points.length; i < max; i++) {
				this.renderGridTile(this.model.points[i]);
			}
		}

		const points = this.model.points.map((p) => this.grid.getCoordinates(p));

		this.path = `M${points[0].x} ${points[0].y} `;
		for (let i = 0, max = points.length - 1; i < max; i++) {
			const middle = points[i].add(points[i + 1].subtract(points[i]).multiply(0.5));
			this.path += `S ${middle.x} ${middle.y}, ${points[i+1].x} ${points[i+1].y} `;
			if (DEBUG_GROUND) {
				this.group.circle(15).fill('blue').center(middle.x, middle.y);
			}
		}

		const gridSize = this.grid.getMaxCoordinates();
		this.path += `L ${gridSize.x} ${gridSize.y} `;
		this.path += `L 0 ${gridSize.y} Z`;

		const path = this.group.path(this.path).stroke(this.stroke).fill(this.fill);
		path.back();
	}

}
