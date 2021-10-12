import SvgRenderer from "./SvgRenderer";
import {BROWN_DARK, GROUND_DARK, GROUND_LIGHT} from "./Palette";
import {GROUND_TYPE_BASIC} from "../model/GroundTileModel";
import {
	CORNER_LEFT,
	CORNER_LOWER_LEFT,
	CORNER_LOWER_RIGHT,
	CORNER_RIGHT,
	CORNER_UPPER_LEFT,
	CORNER_UPPER_RIGHT
} from "../model/GridModel";

const DEBUG_GROUND = false;

const GROUND_STYLE = {
	'rock': {
		fill: GROUND_LIGHT,
		stroke: { width: 4, color: GROUND_DARK}
	}
};

export default class GroundRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw) {
		super(game, model, draw);
		this.group = null;
	}

	removeTileNeighbors(remaining, tile) {
		const index = remaining.indexOf(tile);
		if (index < 0) {
			return;
		}
		remaining.splice(index, 1);
		const neighborPositions = this.grid.getNeighbors(tile.position);
		const neighbors = neighborPositions.reduce((prev, current) => prev.concat(this.chessboard.getVisitors(current, (v) => v.type === tile.type)), []);
		neighbors.forEach((n) => this.removeTileNeighbors(remaining, n));
	}

	getCornerNeighbor(tile, cornerType) {
		let neighborPosition = null;
		switch (cornerType) {
			case CORNER_UPPER_LEFT:
				neighborPosition = this.grid.getNeighborUp(tile.position);
				break;
			case CORNER_UPPER_RIGHT:
				neighborPosition = this.grid.getNeighborUpperRight(tile.position);
				break;
			case CORNER_RIGHT:
				neighborPosition = this.grid.getNeighborLowerRight(tile.position);
				break;
			case CORNER_LOWER_RIGHT:
				neighborPosition = this.grid.getNeighborDown(tile.position);
				break;
			case CORNER_LOWER_LEFT:
				neighborPosition = this.grid.getNeighborLowerLeft(tile.position);
				break;
			case CORNER_LEFT:
				neighborPosition = this.grid.getNeighborUpperLeft(tile.position);
				break;
		}
		return neighborPosition;
	}

	canUseCorner(tile, cornerType) {
		const position = this.getCornerNeighbor(tile, cornerType);
		const visitors = this.chessboard.getVisitors(position, (g) => g._is_ground);
		return visitors.length === 0;
	}

	renderInternal() {
		if (this.group) this.group.remove();
		this.group = this.draw.group();

		const tilesCollection = this.model.tiles;
		const remaining = [...tilesCollection.children];

		while (remaining.length > 0) {

			// find starting tile (must not have neighbors from all sides)
			let startTile = null;
			let i = 0;

			while (startTile === null && i < remaining.length) {
				const tile = remaining[i];
				const neighborPositions = this.grid.getNeighbors(tile.position);
				let neighborCount = neighborPositions.reduce((prev, current) => prev + this.chessboard.getVisitors(current, (v) => v.type === tile.type).length, 0);
				if (neighborCount > 0 && neighborCount < 6) {
					startTile = tile;
				}
				i++;
			}

			if (!startTile) {
				console.log('No start tile');
				return;
			}

			// remove all neighboring tiles of the same type recursively from remaining
			this.removeTileNeighbors(remaining, startTile);

			const edge = [startTile];

			let currentCorner = CORNER_UPPER_RIGHT;
			let currentTile = startTile;

			// find starting corner
			while (!this.canUseCorner(currentTile, currentCorner)) {
				currentCorner = (currentCorner + 1) % 6;
			}

			if (DEBUG_GROUND) {
				const corner = this.grid.getCorner(startTile.position, currentCorner);
				this.group.circle(10).fill('blue').center(corner.x, corner.y);
			}

			// push edges into single group
			do {
				let nextPosition = this.getCornerNeighbor(currentTile, currentCorner);
				let visitors = this.chessboard.getVisitors(nextPosition, (v) => v.type === startTile.type);
				while (visitors.length === 0)
				{
					currentCorner = (currentCorner + 1) % 6;
					nextPosition = this.getCornerNeighbor(currentTile, currentCorner);
					visitors = this.chessboard.getVisitors(nextPosition, (v) => v.type === startTile.type);
				}
				currentTile = visitors[0];
				currentCorner = (currentCorner + 4) % 6;
				if (currentTile !== startTile) {
					edge.push(currentTile);
				}
			} while (currentTile !== startTile)

			// render
			const points = edge.map((t) => this.grid.getCoordinates(t.position));

			if (points.length > 0) {
				let path = `M${points[0].x} ${points[0].y} `;
				for (let i = 0, max = points.length - 1; i < max; i++) {
					const middle = points[i].add(points[i + 1].subtract(points[i]).multiply(0.5));
					path += `S ${middle.x} ${middle.y}, ${points[i + 1].x} ${points[i + 1].y} `;
					if (DEBUG_GROUND) {
						this.group.circle(15).fill('blue').center(middle.x, middle.y);
					}
				}
				path += ` Z`;

				const style = GROUND_STYLE[startTile.type];
				const pathDraw = this.group.path(path).stroke(style.stroke).fill(style.fill);
				pathDraw.back();
			}

		}

	}

}
