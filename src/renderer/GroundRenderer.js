import SvgRenderer from "./SvgRenderer";
import {BROWN_DARK, GROUND_DARK} from "./Palette";
import Vector2 from "../class/Vector2";

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
	}

	renderInternal() {
		if (this.group) this.group.remove();
		this.group = this.draw.group();
/*
		const size = this.grid.getMaxPosition();
		for (let i = 1, max = this.model.points.length; i < max; i++) {
			for (let ih = this.model.points[i].y, max = size.y; ih <= max; ih++) {
				this.renderGridTile(new Vector2(this.model.points[i].x, ih));
			}
		}
		*/

		const points = this.model.points.map((p) => this.grid.getCoordinates(p));

		this.path = `M${points[0].x} ${points[0].y} S`;
		for (let i = 1, max = points.length; i < max; i++) {
			this.path += `${points[i].x} ${points[i].y}, `;
			if (DEBUG_GROUND)
				this.group.circle(25).fill('red').move(points[i].x - 12, points[i].y - 12);
		}

		const gridSize = this.grid.getMaxCoordinates();
		this.path += `L 0 ${gridSize.y} `;
		this.path += `L ${gridSize.x} ${gridSize.y} Z`;

		const path = this.group.path(this.path).stroke(this.stroke).fill(this.fill);
		//path.back();

	}

}
