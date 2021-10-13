import SvgRenderer from "./SvgRenderer";
import {BROWN_DARK, BROWN_LIGHT, GREEN_DARK, GREEN_LIGHT, GROUND_DARK, GROUND_LIGHT} from "./Palette";
import {
	GROUND_TYPE_BASIC,
	GROUND_TYPE_GRASS,
	GROUND_TYPE_WOOD,
	GROUND_TYPE_HONEY,
	GROUND_TYPE_ROCK, GROUND_TYPE_WAX, GROUND_TYPE_WATER
} from "../model/GroundTileModel";
import {
	CORNER_LEFT,
	CORNER_LOWER_LEFT,
	CORNER_LOWER_RIGHT,
	CORNER_RIGHT,
	CORNER_UPPER_LEFT,
	CORNER_UPPER_RIGHT
} from "../model/GridModel";

const DEBUG_GROUND = false;

const GROUND_STYLE = [];

GROUND_STYLE[GROUND_TYPE_BASIC] = {
	fill: GROUND_LIGHT,
	stroke: { width: 4, color: GROUND_DARK},
	renderCorners: true
};

GROUND_STYLE[GROUND_TYPE_WOOD] = {
	fill: BROWN_LIGHT,
	stroke: { width: 4, color: BROWN_DARK},
	renderCorners: true
};

GROUND_STYLE[GROUND_TYPE_ROCK] = {
	fill: '#909090',
	stroke: { width: 4, color: '#202020'},
	renderCorners: true
};

GROUND_STYLE[GROUND_TYPE_GRASS] = {
	fill: GREEN_LIGHT,
	stroke: { width: 4, color: GREEN_DARK},
	renderCorners: true
};

GROUND_STYLE[GROUND_TYPE_HONEY] = {
	fill: 'orange',
	stroke: { width: 4, color: 'darkOrange'},
	disableGround: true,
};

GROUND_STYLE[GROUND_TYPE_WAX] = {
	fill: 'darkorange',
	stroke: { width: 4, color: 'brown'},
	disableGround: false,
	renderCorners: true
};

GROUND_STYLE[GROUND_TYPE_WATER] = {
	fill: 'darkblue',
	stroke: { width: 4, color: '#009'},
	disableGround: true,
	renderCorners: true
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
		if (GROUND_STYLE[tile.type].disableGround === true) {
			tile._is_penetrable = true;
		}
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
		const visitors = this.chessboard.getVisitors(position, (v) => v.type === tile.type);
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
				if (neighborCount < 6) {
					startTile = tile;
				}
				i++;
			}

			if (!startTile) {
				console.log('No start tile');
				return;
			}

			const style = GROUND_STYLE[startTile.type];

			// remove all neighboring tiles of the same type recursively from remaining
			this.removeTileNeighbors(remaining, startTile);

			let currentCorner = CORNER_UPPER_RIGHT;
			let currentTile = startTile;

			// find starting corner
			while (!this.canUseCorner(currentTile, currentCorner)) {
				currentCorner = (currentCorner + 1) % 6;
			}

			const startCorner = currentCorner;
			const lastCorner = (startCorner + 2) % 6;

			if (DEBUG_GROUND) {
				const corner = this.grid.getCorner(startTile.position, startCorner);
				this.group.circle(10).fill('purple').center(corner.x, corner.y);
			}

			const points = [];

			if (style.renderCorners) {
				points.push(this.grid.getCorner(startTile.position, startCorner));
			} else {
				points.push(this.grid.getCoordinates(startTile.position));
			}

			// push edges into single group
			do {
				let nextPosition = this.getCornerNeighbor(currentTile, currentCorner);
				let visitors = this.chessboard.getVisitors(nextPosition, (v) => v.type === startTile.type);
				const endCorner = (currentCorner + 5) % 6;
				while (visitors.length === 0 && endCorner !== currentCorner)
				{
					currentCorner = (currentCorner + 1) % 6;
					if ((currentTile === startTile) && (currentCorner === startCorner)) {
						break;
					}
					nextPosition = this.getCornerNeighbor(currentTile, currentCorner);
					visitors = this.chessboard.getVisitors(nextPosition, (v) => v.type === startTile.type);
					if (style.renderCorners)
						points.push(this.grid.getCorner(currentTile.position, currentCorner));
				}
				if (visitors.length > 0 && ((currentTile !== startTile) || (currentCorner !== startCorner))) {
					currentTile = visitors[0];
					currentCorner = (currentCorner + 4) % 6;
				} else {
					currentTile = null;
				}
				if (!style.renderCorners) {
					if (currentTile !== null && currentTile !== startTile) {
						points.push(this.grid.getCoordinates(currentTile.position));
					}
				}
			} while (currentTile !== null && ((currentTile !== startTile) || (currentCorner !== startCorner)));

			// use all corners
			/*
			if (currentTile !== null && style.renderCorners) {
				const lastCorner = (startCorner - 1) % 6;
				while (lastCorner !== currentCorner && startCorner !== currentCorner && this.canUseCorner(currentTile, currentCorner))
				{
					currentCorner = (currentCorner + 1) % 6;
					points.push(this.grid.getCorner(currentTile.position, currentCorner));
				}
			}
*/
			// last

			if (style.renderCorners) {
				points.push(this.grid.getCorner(startTile.position, startCorner));
				points.push(points[1]);
			} else {
				points.push(this.grid.getCoordinates(startTile.position));
			}

			// render
			if (points.length > 1) {

				let middle = points[0].add(points[1].subtract(points[0]).multiply(0.5));
				let path = `M${middle.x} ${middle.y} `;

				if (DEBUG_GROUND) {
					this.group.circle(15).fill('yellow').center(middle.x, middle.y);
				}

				for (let i = 1, max = points.length - 1; i < max; i++) {
					middle = points[i].add(points[i + 1].subtract(points[i]).multiply(0.5));
					path += `S ${points[i].x} ${points[i].y}, ${middle.x} ${middle.y}`;
					if (DEBUG_GROUND) {
						this.group.circle(15).fill('blue').center(middle.x, middle.y);
					}
				}
				path += ` Z`;

				const pathDraw = this.group.path(path).stroke(style.stroke).fill(style.fill);
				pathDraw.back();
			}

		}

	}

}
