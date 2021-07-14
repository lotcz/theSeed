import Grid, {Vector2} from "./Grid";
import {SVG} from "@svgdotjs/svg.js";
import Tree from "./Tree";
import {TreeNode} from "./Tree";

export default class Renderer {
	draw;
	path;
	animation;

	constructor(draw, grid) {
		this.draw = draw;
		this.grid = grid;
		this.group = null;
	}

	renderPath(start, end) {
		const startRadius = start.power * 4;
		const endRadius = end.power * 4;
		const middleRadius = 5 + Math.min(25, Math.min(end.power, start.power));
		const startCoord = this.grid.getCoordinates(start.position);
		const endCoord = this.grid.getCoordinates(end.position);

		if (start.power > end.power) this.group.line(startCoord.x, startCoord.y, endCoord.x, endCoord.y).stroke({ width: 2, color: '#f0f' });

		const down = (startCoord.y < endCoord.y);
		const left = (startCoord.x > endCoord.x);

		const a = Math.abs(endCoord.x - startCoord.x);
		const c = startCoord.distanceTo(endCoord);
		const cosX = (a / c);
		const x = Math.acos(cosX);
		const y = (Math.PI/2) - x;
		const dx = middleRadius * Math.cos(y);
		const dy = middleRadius * Math.sin(y);

		const middleCoordX = (startCoord.x + endCoord.x) / 2 + (down ? -dx : dx);
		const middleCoordY = (startCoord.y + endCoord.y) / 2 + (left ? -dy : dy);
		this.group.circle().radius(5).attr({fill: down ? '#f00' : '#0f0'}).move(middleCoordX - 5, middleCoordY - 5);

		this.path += `${startCoord.x} ${startCoord.y}, ${middleCoordX} ${middleCoordY},`;
		this.animation += `${startCoord.x + ((down) ? -35 : 35)} ${startCoord.y}, ${middleCoordX + ((down) ? -5 : 5)} ${middleCoordY}, `;
	}

	renderNode(node) {
		const nodeCoord = this.grid.getCoordinates(node.position);
		const radius = 4;
		const circle = this.group.circle().radius(radius).attr({r: radius, fill: '#00f'}).move(nodeCoord.x - radius, nodeCoord.y - radius);
		//circle.animate(2000).attr({r: radius + 1}).loop(true, true);

		for (let i = 0, max = node.children.length; i < max; i++) {
			const child = node.children[i];
			this.renderPath(node, child);
			this.renderNode(child);
		}

		if (node.parent) {
			this.renderPath(node, node.parent);
		}
	}

	render(tree) {
		if (this.group) this.group.remove();
		this.group = this.draw.group();
		const rootCoord = this.grid.getCoordinates(tree.root.position);
		this.path = `M${rootCoord.x - 40} ${rootCoord.y} S`;
		this.animation = `M${rootCoord.x - 20} ${rootCoord.y} S`;

		this.renderNode(tree.root);

		this.path += `${rootCoord.x} ${rootCoord.y}, ${rootCoord.x + 40} ${rootCoord.y}`;
		this.animation += `${rootCoord.x} ${rootCoord.y}, ${rootCoord.x + 20} ${rootCoord.y}`;

		const path = this.group.path(this.path).stroke({ width: 4, color: '#0ff' });
		//path.animate(2000).plot(this.animation).loop(true, true);
		path.back();
	}

}
