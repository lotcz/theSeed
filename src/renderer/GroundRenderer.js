import SvgRenderer from "./SvgRenderer";
import {BROWN_DARK, GROUND_DARK, GROUND_LIGHT} from "./Palette";
import {GROUND_TYPE_BASIC} from "../model/GroundTileModel";

const DEBUG_GROUND = true;

const GROUND_STYLE_BASIC = {
		fill: GROUND_LIGHT,
		stroke: { width: 4, color: GROUND_DARK}
	};

const GROUND_STYLE = [
	GROUND_TYPE_BASIC => GROUND_STYLE_BASIC
];

export default class GroundRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw) {
		super(game, model, draw);
		this.group = null;
	}

	renderDebugGridTile(position) {
		const corners = this.grid
			.getCorners(position)
			.map((c) => [c.x, c.y]);
		corners.push(corners[0]);
		this.group.polyline(corners).fill('transparent').stroke({width: 1, color: GROUND_DARK});
		const coordinates = this.grid.getCoordinates(position);
		this.group.circle(25).fill('red').center(coordinates.x, coordinates.y);
	}

	renderInternal() {
		if (this.group) this.group.remove();
		this.group = this.draw.group();

		const tilesCollection = this.model.tiles;

		if (DEBUG_GROUND) {
			tilesCollection.forEach((tile) => this.renderDebugGridTile(tile.position));
		}

		// find starting tile (must not have neighbors from all sides)
		// identify edge tiles
		// render

		const points = tilesCollection.children.map((t) => this.grid.getCoordinates(t.position));
/*
		if (points.length > 0) {
			this.path = `M${points[0].x} ${points[0].y} `;
			for (let i = 0, max = points.length - 1; i < max; i++) {
				const middle = points[i].add(points[i + 1].subtract(points[i]).multiply(0.5));
				this.path += `S ${middle.x} ${middle.y}, ${points[i + 1].x} ${points[i + 1].y} `;
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
		*/

	}

}
