import Vector2 from "../class/Vector2";
import GameRenderer from "../renderer/GameRenderer";
import GameModel from "../model/GameModel";
import Controls from "../class/Controls";
import {SVG} from "@svgdotjs/svg.js";

const GUTTER_WIDTH = 150;

export default class GameController {
	draw;
	dom;
	renderer;
	model;
	controls;

	constructor(dom) {
		this.dom = dom;
		this.lastTime = null;
		this.draw = SVG().addTo(dom);
		this.controls = new Controls(this.draw.node);
		this.model = new GameModel();
		this.renderer = new GameRenderer(this.draw, this.model);
		this.updateLoop = () => this.update();
		window.addEventListener('resize', (e) => this.onResize());
		this.onResize();
	}

	update() {
		const time = performance.now();
		if (!this.lastTime) this.lastTime = time;
		const delta = (time - this.lastTime) / 1000;
		this.lastTime = time;

		if (this.controls.isDirty()) {
			if (this.controls.mouseCoords.isDirty()) {
				this.onMouseMove();
				this.controls.mouseCoords.clean();
			}
			if (this.controls.mouseClick && this.controls.mouseClick.isDirty()) {
				this.onClick(this.controls.mouseClick);
				this.controls.mouseClick.clean();
			}
			if (this.controls.zoom.isDirty()) {
				this.onZoom();
				this.controls.resetZoom();
			}
			this.controls.clean();
		}

		if (this.controls.mouseOver) {
			this.scroll(delta);
		}
		this.renderer.render();
		requestAnimationFrame(this.updateLoop);
	}

	getCursorAbsolutePosition(offset) {
		return new Vector2(this.model.viewBoxPosition.x + (offset.x * this.model.viewBoxScale.get()), this.model.viewBoxPosition.y + (offset.y * this.model.viewBoxScale.get()));
	}

	getCursorGridPosition(offset) {
		return this.model.grid.getPosition(this.getCursorAbsolutePosition(offset));
	}

	onMouseMove() {
		const mousePosition = this.getCursorGridPosition(this.controls.mouseCoords);
		this.model.highlightedTilePosition.set(mousePosition);
	}

	scroll(delta) {
		const mouseCoords = this.controls.mouseCoords;
		const scrolling = new Vector2();
		if (mouseCoords.x < GUTTER_WIDTH) {
			scrolling.x = mouseCoords.x - GUTTER_WIDTH;
		} else if ((this.model.viewBoxSize.x - mouseCoords.x) < GUTTER_WIDTH) {
			scrolling.x = GUTTER_WIDTH - this.model.viewBoxSize.x + mouseCoords.x;
		}
		if (mouseCoords.y < GUTTER_WIDTH) {
			scrolling.y = mouseCoords.y - GUTTER_WIDTH;
		} else if ((this.model.viewBoxSize.y - mouseCoords.y) < GUTTER_WIDTH) {
			scrolling.y = GUTTER_WIDTH - this.model.viewBoxSize.y + mouseCoords.y;
		}

		if (scrolling.size() > 0) {
			this.model.viewBoxPosition.set(this.model.viewBoxPosition.x + (scrolling.x * delta), this.model.viewBoxPosition.y + (scrolling.y * delta));
		}
	}

	onClick(mouseCoords) {
		const position = this.getCursorGridPosition(mouseCoords);
		const root = this.model.plant.roots.findNodeOnPos(position);
		const stem = this.model.plant.stem.findNodeOnPos(position);
		if (root === null && stem === null) {
			// ROOTS
			const above = this.model.plant.roots.findNodeOnPos(new Vector2(position.x, position.y - 1));
			if (above !== null) {
				this.model.plant.roots.addRoot(above, position);
			} else {
				const nodes = this.model.plant.roots.findNodesCloseTo(position, 1.5);
				if (nodes.length > 0) {
					const validnodes = nodes
						.filter((n) => n.position.y < position.y && (!n.isRoot()))
						.sort((a, b) => a.position.y - b.position.y);
					if (validnodes.length > 0) {
						this.model.plant.roots.addRoot(validnodes[0], position);
					}
				}
			}
			// STEM
			const below = this.model.plant.stem.findNodeOnPos(new Vector2(position.x, position.y + 1));
			if (below !== null) {
				this.model.plant.stem.addStem(below, position);
			} else {
				const neighbors = this.model.plant.stem.findNodesCloseTo(position, 1.5);
				if (neighbors.length > 0) {
					const valids = neighbors
						.filter((n) => n.position.y > position.y && (!n.isRoot()))
						.sort((a, b) => b.position.y - a.position.y);
					if (valids.length > 0) {
						this.model.plant.stem.addStem(valids[0], position);
					}
				}
			}
		}
	}

	onZoom() {
		const before = this.getCursorAbsolutePosition(this.controls.mouseCoords);
		const delta = (this.model.viewBoxScale.get() / 10) * this.controls.zoom.get();
		this.model.viewBoxScale.set(Math.max( 0.1, Math.min(100, this.model.viewBoxScale.get() + delta)));

		const after = this.getCursorAbsolutePosition(this.controls.mouseCoords);
		const diff = after.subtract(before);
		this.model.viewBoxPosition.set(this.model.viewBoxPosition.x - diff.x, this.model.viewBoxPosition.y - diff.y);
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
	}

}
