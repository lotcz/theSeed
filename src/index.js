import { SVG } from '@svgdotjs/svg.js';
import Grid, {Vector2} from "./Grid";
import Tree from "./Tree";
import {TreeNode} from "./Tree";
import Renderer from "./Renderer";

const root = new TreeNode(new Vector2(5, 0));
let n = root.addChild(new TreeNode(new Vector2(root.position.x, root.position.y + 1)));
let r = n.addChild(new TreeNode(new Vector2(root.position.x + 1, root.position.y + 2)));
r = r.addChild(new TreeNode(new Vector2(root.position.x + 2, root.position.y + 3)));
n = n.addChild(new TreeNode(new Vector2(root.position.x - 1, root.position.y + 2)));
n.addChild(new TreeNode(new Vector2(root.position.x , root.position.y + 3)));
n.addChild(new TreeNode(new Vector2(root.position.x - 2, root.position.y + 3)));
const roots = new Tree(root);

const grid = new Grid(new Vector2(10, 10), new Vector2(120, 80));
const draw = SVG().addTo('body').size(grid.size.x * grid.scale.x, grid.size.y * grid.scale.y);
const renderer = new Renderer(draw, grid);
renderer.render(roots);

let tile = null;
let lastPos = null;

function spawnRoot(parent, position) {
	parent.addChild(new TreeNode(position));
	renderer.render(roots);
}

const onMouseMove = function(e) {
	const position = grid.getPosition(new Vector2(e.offsetX, e.offsetY));
	if (lastPos == null || position.distanceTo(lastPos) > 0) {
		if (tile) tile.remove();
		lastPos = position;
		const box = grid.getBox(position);
		tile = draw.rect(box.w, box.h).move(box.x, box.y).fill('transparent').stroke({ width: 2, color: 'blue'});
	}
}
draw.node.addEventListener('mousemove', onMouseMove);

const onClick = function(e) {
	const position = grid.getPosition(new Vector2(e.offsetX, e.offsetY));
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
