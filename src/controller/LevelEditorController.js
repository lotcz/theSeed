import ControllerBase from "../class/ControllerBase";
import {EDITOR_TOOL_DELETE, EDITOR_TOOL_SELECT} from "../model/LevelEditorModel";
import {
	EDITOR_MODE_GROUND,
	EDITOR_MODE_SPRITES
} from "../model/LevelEditorModel";
import LevelBuilder from "../builder/LevelBuilder";

const DEBUG_EDITOR_CONTROLLER = false;

export default class LevelEditorController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.lastMouseCoords = null;
		this.lastHighlight = null;
	}

	activateInternal() {
		this.model.showGroundTiles.makeDirty();
		this.model.showSpriteHelpers.makeDirty();
		this.controls.mouseClick = null;
	}

	updateInternal(delta) {
		if (this.controls.isDirty()) {

			if (this.controls.mouseCoords.isDirty()) {
				this.onMouseMove();
				this.controls.mouseCoords.clean();
			}
			if (this.controls.mouseClick && this.controls.mouseClick.isDirty()) {
				const position = this.getCursorGridPosition(this.controls.mouseClick);
				if (this.controls.mouseClickLeft) {
					this.processClick(position);
				}
				this.controls.mouseClick.clean();
			}

			if (this.controls.zoom.isDirty()) {
				this.onZoom();
				this.controls.resetZoom();
			}
			this.controls.clean();
		}

		this.scroll(delta);
	}

	getAffectedPositions(position) {
		return this.level.grid.getAffectedPositions(position, Math.round(this.model.brushSize));
	}

	addGroundTile(position) {
		if (!this.level.isValidPosition(position)) {
			if (DEBUG_EDITOR_CONTROLLER) console.log('Skipping invalid position:', position);
			return;
		}
		switch (this.model.selectedGroundType) {
			case EDITOR_TOOL_DELETE:
				const visitors = this.chessboard.getTile(position);
				const groundVisitors = visitors.filter((v) => v._is_ground === true);
				if (groundVisitors.length > 0) {
					this.level.ground.removeTile(groundVisitors[0]);
				}
				break;
			default:
				const visitors2 = this.chessboard.getTile(position);
				const groundVisitors2 = visitors2.filter((v) => v._is_ground === true);
				groundVisitors2.forEach((v) => this.level.ground.removeTile(v));
				const builder = new LevelBuilder(this.level);
				builder.addTileFromStyle(position, this.model.selectedGroundType);
		}

	}

	processClick(position) {
		switch (this.model.selectedMode.get()) {
			case EDITOR_MODE_SPRITES:
				this.processSpriteClick(position);
				break;

			case EDITOR_MODE_GROUND:
				this.processGroundClick(position);
				break;
		}
	}

	processGroundClick(position) {
		const positions = this.getAffectedPositions(position);
		positions.forEach((p) => this.addGroundTile(p));
	}

	processSpriteClick(position) {
		switch (this.model.selectedSpriteType) {
			case EDITOR_TOOL_DELETE:
				const positions = this.getAffectedPositions(position);
				positions.forEach((pos) => {
					const visitors = this.chessboard.getTile(pos);
					const spriteVisitors = visitors.filter((v) => v._is_sprite === true);
					spriteVisitors.forEach((sprite) => this.level.sprites.remove(sprite));
				});
				break;
			case EDITOR_TOOL_SELECT:
				const visitors2 = this.chessboard.getVisitors(position, (v) => v._is_sprite === true);
				this.model.selectedSprites.set(visitors2);
				break;
			default:
				const builder = new LevelBuilder(this.level);
				builder.addSpriteFromStyle(position, this.model.selectedSpriteType);
				break;
		}

	}

	getCursorGridPosition(offset) {
		return this.grid.getPosition(this.level.getAbsoluteCoordinates(offset));
	}

	activateClickWhenDragging() {
		return (this.model.selectedMode.get() === EDITOR_MODE_GROUND);
	}

	onMouseMove() {
		const mousePosition = this.getCursorGridPosition(this.controls.mouseCoords);

		if (this.controls.mouseDownLeft && this.activateClickWhenDragging()) {
			const position = this.getCursorGridPosition(this.controls.mouseCoords);
			this.processClick(position);
		} else {
			let moved = true;
			if (this.lastHighlight !== null) {
				moved = (this.lastHighlight.distanceTo(mousePosition) > 0);
			}
			if (moved) {
				this.model.highlightedTilePosition.set(mousePosition);
				this.model.highlights.resetChildren();
				const positions = this.getAffectedPositions(mousePosition);
				positions.forEach((p) => this.model.highlights.add(p));
				this.lastHighlight = mousePosition;
			}
		}
	}

	scroll(delta) {
		const speed = this.level.viewBoxScale.get(); //delta / 100;

		if (this.controls.mouseDownRight) {
			if (this.lastMouseCoords !== null) {
				const diff = this.lastMouseCoords.subtract(this.controls.mouseCoords);
				this.level.viewBoxCoordinates.set(this.level.viewBoxCoordinates.x + (diff.x * speed), this.level.viewBoxCoordinates.y + (diff.y * speed));
				this.level.sanitizeViewBox();
			}
			this.lastMouseCoords = this.controls.mouseCoords;
		} else {
			this.lastMouseCoords = null;
		}

	}

	onZoom() {
		const zoomIn = this.controls.zoom.get() < 0;
		const delta = (this.level.viewBoxScale.get() / 10) * this.controls.zoom.get();
		const before = this.level.getAbsoluteCoordinates(zoomIn ? this.controls.mouseCoords : this.level.viewBoxSize.multiply(0.5));

		this.level.viewBoxScale.set(Math.max( 0.1, Math.min(100, this.level.viewBoxScale.get() + delta)));

		const after = this.level.getAbsoluteCoordinates(zoomIn ? this.controls.mouseCoords : this.level.viewBoxSize.multiply(0.5));
		const diff = after.subtract(before);
		this.level.viewBoxCoordinates.set(this.level.viewBoxCoordinates.x - diff.x, this.level.viewBoxCoordinates.y - diff.y);
		this.level.sanitizeViewBox();
	}

}
