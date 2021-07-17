import SvgRenderer from "./SvgRenderer";

const DEBUG_LIVING_TREE = false;

export default class LivingTreeRenderer extends SvgRenderer {
	path;
	upwards;
	fill;
	stroke;

	constructor(draw, model, grid, upwards, fill, stroke) {
		super(draw, model);
		this.upwards = upwards;
		this.fill = fill;
		this.stroke = stroke;
		this.grid = grid;
		this.group = null;
	}

	getNodeRadius(node) {
		return 5 + Math.min(25, node.power);
	}

	getEdgeRadius(start, end) {
		return 5 + Math.min(25, Math.min(end.power, start.power));
	}

	renderPath(start, end) {
		const middleRadius = this.getEdgeRadius(start, end);
		const startCoord = this.grid.getCoordinates(start.position);
		const endCoord = this.grid.getCoordinates(end.position);

		if (DEBUG_LIVING_TREE) {
			if (start.power > end.power) this.group.line(startCoord.x, startCoord.y, endCoord.x, endCoord.y).stroke({
				width: 2,
				color: '#f0f'
			});
		}

		const down = this.upwards ? (startCoord.y > endCoord.y) : (startCoord.y < endCoord.y);
		const left = this.upwards ? (startCoord.x < endCoord.x) : (startCoord.x > endCoord.x);

		const a = Math.abs(endCoord.x - startCoord.x);
		const c = startCoord.distanceTo(endCoord);
		const cosX = (a / c);
		const x = Math.acos(cosX);
		const y = (Math.PI/2) - x;
		const dx = middleRadius * Math.cos(y);
		const dy = middleRadius * Math.sin(y);

		const middleCoordX = (startCoord.x + endCoord.x) / 2 + (down ? -dx : dx);
		const middleCoordY = (startCoord.y + endCoord.y) / 2 + (left ? -dy : dy);

		if (DEBUG_LIVING_TREE) {
			this.group.circle().radius(5).attr({fill: down ? '#f00' : '#0f0'}).move(middleCoordX - 5, middleCoordY - 5);
		}

		this.path += `${startCoord.x} ${startCoord.y}, ${middleCoordX} ${middleCoordY},`;
	}

	renderNode(node) {
		const nodeCoord = this.grid.getCoordinates(node.position);
		const radius = 4;

		if (DEBUG_LIVING_TREE) {
			const circle = this.group.circle().radius(radius).attr({
				r: radius,
				fill: '#00f'
			}).move(nodeCoord.x - radius, nodeCoord.y - radius);
		}

		for (let i = 0, max = node.children.length; i < max; i++) {
			const child = node.children[i];
			this.renderPath(node, child);
			this.renderNode(child);
		}

		if (node.parent) {
			this.renderPath(node, node.parent);
		}
	}

	renderInternal() {
		if (this.group) this.group.remove();
		this.group = this.draw.group();
		const root = this.model;
		const rootCoord = this.grid.getCoordinates(root.position);
		this.path = `M${rootCoord.x - this.getNodeRadius(root)} ${rootCoord.y} S`;

		this.renderNode(root);

		this.path += `${rootCoord.x} ${rootCoord.y}, ${rootCoord.x + this.getNodeRadius(root)} ${rootCoord.y}`;

		const path = this.group.path(this.path).stroke(this.stroke).fill(this.fill);
		path.back();
	}

}
