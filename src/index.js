import "./style.css";
import { SVG } from '@svgdotjs/svg.js';
import Grid, {Vector2} from "./Grid";
import Tree from "./Tree";
import {TreeNode} from "./Tree";
import Renderer from "./Renderer";

const root = new TreeNode(new Vector2(15, 10));
let n = root.addChild(new TreeNode(new Vector2(root.position.x, root.position.y + 1)));
let r = n.addChild(new TreeNode(new Vector2(root.position.x + 1, root.position.y + 2)));
r = r.addChild(new TreeNode(new Vector2(root.position.x + 2, root.position.y + 3)));
n = n.addChild(new TreeNode(new Vector2(root.position.x - 1, root.position.y + 2)));
n.addChild(new TreeNode(new Vector2(root.position.x , root.position.y + 3)));
n.addChild(new TreeNode(new Vector2(root.position.x - 2, root.position.y + 3)));
const roots = new Tree(root);

let viewBoxScale = 1;
const viewBoxSize = new Vector2(100, 100);
const viewBoxPosition = new Vector2(250, 150);

const grid = new Grid(new Vector2(100, 100), new Vector2(120, 80));
const draw = SVG().addTo('body');
const renderer = new Renderer(draw, grid);

function spawnRoot(parent, position) {
	parent.addChild(new TreeNode(position));
	renderer.render(roots);
}

function render() {
	draw.size(viewBoxSize.x, viewBoxSize.y);
	draw.viewbox(viewBoxPosition.x, viewBoxPosition.y, viewBoxSize.x * viewBoxScale, viewBoxSize.y * viewBoxScale);
	renderer.render(roots);
}

function getCursorGridPosition(offsetX, offsetY) {
	return grid.getPosition(new Vector2((offsetX * viewBoxScale) + viewBoxPosition.x, (offsetY * viewBoxScale) + viewBoxPosition.y));
}

let tile = null;
let lastPos = null;

const onMouseMove = function(e) {
	const position = getCursorGridPosition(e.offsetX, e.offsetY);
	if (lastPos == null || position.distanceTo(lastPos) > 0) {
		if (tile) tile.remove();
		lastPos = position;
		const box = grid.getBox(position);
		tile = draw.rect(box.w, box.h).move(box.x, box.y).fill('transparent').stroke({ width: 2, color: 'blue'});
	}
}
draw.node.addEventListener('mousemove', onMouseMove);

const onClick = function(e) {
	const position = getCursorGridPosition(e.offsetX, e.offsetY);
	const node = roots.findNodeOnPos(position);
	if (node == null) {
		const above = roots.findNodeOnPos(new Vector2(position.x, position.y - 1));
		if (above !== null) {
			spawnRoot(above, position);
		} else {
			const nodes = roots.findNodesCloseTo(position, 1.5);
			if (nodes.length > 0) {
				const validnodes = nodes
					.filter((n) => n.position.y < position.y && (!n.isRoot()))
					.sort((a, b) => a.position.y - b.position.y);
				if (validnodes.length > 0) {
					spawnRoot(validnodes[0], position);
				}
			}
		}
	}
}
draw.node.addEventListener('click', onClick);

const onZoom = function(e) {
	viewBoxScale = Math.max( 0.1, Math.min(100, viewBoxScale += (e.deltaY * 0.001)));
	render();
}

draw.node.addEventListener('wheel', onZoom);

const onResize = function(e) {
	viewBoxSize.set(window.innerWidth, window.innerHeight);
	render();
}

window.addEventListener('resize', onResize);
onResize();
