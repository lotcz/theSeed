import ControllerBase from "./ControllerBase";
import {EDITOR_TOOL_DELETE, EDITOR_TOOL_SELECT} from "../model/LevelEditorModel";
import {
	EDITOR_MODE_GROUND,
	EDITOR_MODE_SPRITES
} from "../model/LevelEditorModel";

import SpriteBuilder from "../builder/SpriteBuilder";
import {RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
import {SPRITE_STYLES} from "../renderer/Palette";

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

	getAffectedPositions(position, steps = 1) {
		const level = this.game.level.get();
		const positions = [];
		let start = position;
		let stepsRemaining = steps;

		while (stepsRemaining > 0) {
			positions.push(start);
			for (let i = 1; i < steps; i++) {
				positions.push(level.grid.getNeighborLowerLeft(start, i));
			}
			start = level.grid.getNeighborUp(start);
			stepsRemaining--;
		}

		stepsRemaining = steps;
		start = position;
		while (stepsRemaining > 0) {
			//positions.push(start);
			for (let i = 1; i < steps; i++) {
				positions.push(level.grid.getNeighborLowerRight(start, i));
			}
			start = level.grid.getNeighborUp(start);
			stepsRemaining--;
		}

		stepsRemaining = steps;
		start = position;
		while (stepsRemaining > 0) {
			//positions.push(start);
			for (let i = 1; i < steps; i++) {
				positions.push(level.grid.getNeighborLowerRight(start, i));
			}
			start = level.grid.getNeighborLowerLeft(start);
			stepsRemaining--;
		}

		return positions;
	}

	addGroundTile(position) {
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
				this.level.ground.addTile({position: position.toArray(), type: this.model.selectedGroundType});
		}

	}

	processGroundClick(position) {
		const level = Math.round(this.model.brushSize);
		const positions = this.getAffectedPositions(position, level);
		positions.forEach((p) => this.addGroundTile(p));
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

	processSpriteClick(position) {
		const level = this.game.level.get();
		const builder = new SpriteBuilder(level);

		switch (this.model.selectedSpriteType) {
			case EDITOR_TOOL_DELETE:
				const visitors = this.chessboard.getTile(position);
				const spriteVisitors = visitors.filter((v) => v._is_sprite === true);

				spriteVisitors.forEach((sprite) => level.sprites.remove(sprite));
				break;
			case EDITOR_TOOL_SELECT:
				const visitors2 = this.chessboard.getVisitors(position, (v) => v._is_sprite === true);
				this.model.selectedSprites.reset();
				visitors2.forEach((sprite) => this.model.selectedSprites.add(sprite));
				break;
			default:
				const style = SPRITE_STYLES[this.model.selectedSpriteType];
				let uri = null;
				if (style.image) {
					level.addResource(RESOURCE_TYPE_IMAGE, style.image.uri, style.image.resource);
					uri = style.image.uri;
				}
				builder.addSprite(
					position,
					1,
					false,
					0,
					uri,
					style.strategy
				);
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
				const level = Math.round(this.model.brushSize);
				//const session = Pixies.startDebugSession('affected positions');
				const positions = this.getAffectedPositions(mousePosition, level);
				//Pixies.finishDebugSession(session);
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
