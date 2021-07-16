import "./style.css";
import {off, SVG} from '@svgdotjs/svg.js';
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
const gutterWidth = 150;

const grid = new Grid(new Vector2(100, 100), new Vector2(120, 80));
const draw = SVG().addTo('body');
const renderer = new Renderer(draw, grid);

function spawnRoot(parent, position) {
	parent.addChild(new TreeNode(position));
	renderRoots();
}

function renderViewBox() {
	draw.size(viewBoxSize.x, viewBoxSize.y);
	draw.viewbox(viewBoxPosition.x, viewBoxPosition.y, viewBoxSize.x * viewBoxScale, viewBoxSize.y * viewBoxScale);
}

function renderRoots() {
	renderer.render(roots);
}

function getCursorAbsolutePosition(offsetX, offsetY) {
	return new Vector2(viewBoxPosition.x + (offsetX * viewBoxScale), viewBoxPosition.y + (offsetY * viewBoxScale));
}

function getCursorGridPosition(offsetX, offsetY) {
	return grid.getPosition(getCursorAbsolutePosition(offsetX, offsetY));
}

let tile = null;
let lastPos = null;
let lastTime = null;
const scrolling = new Vector2(0, 0);

function update() {
	const time = performance.now();
	if (!lastTime) lastTime = time;
	const delta = (time - lastTime) / 1000;
	lastTime = time;
	if (scrolling.size() > 0) {
		viewBoxPosition.x += scrolling.x * delta;
		viewBoxPosition.y += scrolling.y * delta;
		renderViewBox();
	}
	requestAnimationFrame(() => update());
}

const onMouseMove = function(e) {
	if (e.offsetX < gutterWidth) {
		scrolling.x = e.offsetX - gutterWidth;
	} else if ((viewBoxSize.x - e.offsetX) < gutterWidth) {
		scrolling.x = gutterWidth - (viewBoxSize.x - e.offsetX);
	} else {
		scrolling.x = 0;
	}
	if (e.offsetY < gutterWidth) {
		scrolling.y = e.offsetY - gutterWidth;
	} else if ((viewBoxSize.y - e.offsetY) < gutterWidth) {
		scrolling.y = gutterWidth - (viewBoxSize.y - e.offsetY);
	} else {
		scrolling.y = 0;
	}

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
	const before = getCursorAbsolutePosition(e.offsetX, e.offsetY);
	const delta = (viewBoxScale / 10) * (e.deltaY > 0 ? 1 : -1);
	viewBoxScale = Math.max( 0.1, Math.min(100, viewBoxScale + delta));

	const after = getCursorAbsolutePosition(e.offsetX, e.offsetY);
	const diff = after.subtract(before);
	viewBoxPosition.x -= diff.x;
	viewBoxPosition.y -= diff.y;

	renderViewBox();
}

draw.node.addEventListener('wheel', onZoom);

const onResize = function(e) {
	viewBoxSize.set(window.innerWidth, window.innerHeight);
	renderViewBox();
}

window.addEventListener('resize', onResize);

onResize();
renderRoots();
update();
