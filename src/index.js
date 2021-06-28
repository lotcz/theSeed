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
		const nodes = roots.findNodesCloseTo(position, 1.5);
		nodes[0].addChild(new TreeNode(position));
		renderer.render(roots);
	}
}
draw.node.addEventListener('click', onClick);
