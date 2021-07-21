import Vector2 from "../class/Vector2";
import {} from "@svgdotjs/svg.filter.js"
import LivingTreeModel from "../model/LivingTreeModel";
import ControllerBase from "./ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";

const GUTTER_WIDTH = 150;

export default class LevelController extends ControllerBase {
	constructor(grid, model, controls) {
		super(grid, model, controls);

		this.spritesController = new SpriteCollectionController(grid, model.sprites, controls);
	}

	update(delta) {

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

		this.spritesController.update(delta);
	}

	getCursorAbsolutePosition(offset) {
		return new Vector2(this.model.viewBoxCoordinates.x + (offset.x * this.model.viewBoxScale.get()), this.model.viewBoxCoordinates.y + (offset.y * this.model.viewBoxScale.get()));
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
		const speed = delta / 100;
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
			this.model.viewBoxCoordinates.set(this.model.viewBoxCoordinates.x + (scrolling.x * speed), this.model.viewBoxCoordinates.y + (scrolling.y * speed));
		}
	}

	addNode(parent, position) {
		parent.addChild(new LivingTreeModel({position: position.toArray(), power: 1}));
	}

	findRootCandidate(position) {
		const node = this.model.plant.roots.findNodeOnPos(position);
		if (node && !node.isRoot()) return node;
		return null;
	}

	findStemCandidate(position) {
		const node = this.model.plant.stem.findNodeOnPos(position);
		if (node && !node.isRoot()) return node;
		return null;
	}

	onClick(mouseCoords) {
		const position = this.getCursorGridPosition(mouseCoords);
		const root = this.model.plant.roots.findNodeOnPos(position);
		const stem = this.model.plant.stem.findNodeOnPos(position);
		if (root === null && stem === null) {
			// ROOTS
			const above = this.findRootCandidate(this.model.grid.getNeighborUp(position));
			if (above !== null) {
				this.addNode(above, position);
				return;
			}
			const upperLeft = this.findRootCandidate(this.model.grid.getNeighborUpperLeft(position));
			if (upperLeft !== null) {
				this.addNode(upperLeft, position);
				return;
			}
			const upperRight = this.findRootCandidate(this.model.grid.getNeighborUpperRight(position));
			if (upperRight !== null) {
				this.addNode(upperRight, position);
				return;
			}
			// STEM
			const below = this.findStemCandidate(this.model.grid.getNeighborDown(position));
			if (below !== null) {
				this.addNode(below, position);
				return;
			}
			const lowerLeft = this.findStemCandidate(this.model.grid.getNeighborLowerLeft(position));
			if (lowerLeft !== null) {
				this.addNode(lowerLeft, position);
				return;
			}
			const lowerRight = this.findStemCandidate(this.model.grid.getNeighborLowerRight(position));
			if (lowerRight !== null) {
				this.addNode(lowerRight, position);
				return;
			}
		}
	}

	onZoom() {
		const before = this.getCursorAbsolutePosition(this.controls.mouseCoords);
		const delta = (this.model.viewBoxScale.get() / 10) * this.controls.zoom.get();
		this.model.viewBoxScale.set(Math.max( 0.1, Math.min(100, this.model.viewBoxScale.get() + delta)));

		const after = this.getCursorAbsolutePosition(this.controls.mouseCoords);
		const diff = after.subtract(before);
		this.model.viewBoxCoordinates.set(this.model.viewBoxCoordinates.x - diff.x, this.model.viewBoxCoordinates.y - diff.y);
	}

}
