import ControllerBase from "./ControllerBase";
import {EDITOR_TOOL_DELETE, SPRITE_TYPE_RESPAWN} from "../model/LevelEditorModel";
import {
	EDITOR_MODE_GROUND,
	EDITOR_MODE_SPRITES,
	SPRITE_TYPE_BUG,
	SPRITE_TYPE_BUTTERFLY,
	SPRITE_TYPE_WATER
} from "../model/LevelEditorModel";

import SpriteBuilder, {IMAGE_BUG, IMAGE_BUTTERFLY, IMAGE_WATER,} from "../builder/SpriteBuilder";
import {STRATEGY_BUG, STRATEGY_BUTTERFLY, STRATEGY_RESPAWN, STRATEGY_WATER} from "./SpriteController";
import {RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";

import ButterflyImage from "../../res/img/butterfly.svg";
import LadybugImage from "../../res/img/my-lady-bug.svg";
import WaterImage from "../../res/img/water.svg";
import {GROUND_STYLES} from "../renderer/Palette";
import VectorCollectionModel from "../model/VectorCollectionModel";

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

	findAffectedPositionsInternal(positions, position, level = 1) {
		positions.add(position);
		if (level > 1) {
			const neighbors = this.grid.getNeighbors(position);
			neighbors.forEach((n) =>
			{
				const affected = this.getAffectedPositions(n, level - 1);
				affected.forEach((a) =>	positions.add(a));
			});
		}
	}

	getAffectedPositions(position, level = 1) {
		const positions = new VectorCollectionModel();
		this.findAffectedPositionsInternal(positions, position, level);
		return positions.children;
	}

	processClick(position) {
		switch (this.model.selectedMode.get()) {
			case EDITOR_MODE_SPRITES:
				this.addSprite(position);
				break;

			case EDITOR_MODE_GROUND:
				this.processGroundClick(position);
				break;
		}
	}

	processGroundClick(position) {
		const level = Math.round(this.model.brushSize);
		const positions = this.getAffectedPositions(position, level);
		positions.forEach((p) => this.addGroundTile(p));
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

	addSprite(position) {
		const builder = new SpriteBuilder(this.level);

		switch (this.model.selectedSpriteType) {
			case SPRITE_TYPE_BUTTERFLY:
				this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BUTTERFLY, ButterflyImage);
				builder.addSprite(
					position,
					0.5 + Math.random(),
					false,
					0,
					IMAGE_BUTTERFLY,
					STRATEGY_BUTTERFLY
				);
				break;
			case SPRITE_TYPE_BUG:
				this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BUG, LadybugImage);
				builder.addSprite(
					position,
					0.5 + Math.random(),
					false,
					0,
					IMAGE_BUG,
					STRATEGY_BUG
				);
				break;
			case SPRITE_TYPE_WATER:
				this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WATER, WaterImage);
				builder.addSprite(
					position,
					0.5 + Math.random(),
					false,
					0,
					IMAGE_WATER,
					STRATEGY_WATER,
					{amount: Math.random() * 5}
				);
				break;
			case SPRITE_TYPE_RESPAWN:
				//this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WATER, WaterImage);
				builder.addSprite(
					position,
					0.5 + Math.random(),
					false,
					0,
					null,
					STRATEGY_RESPAWN,
					{name: 'default'}
				);
				break;
			case EDITOR_TOOL_DELETE:
				const visitors = this.chessboard.getTile(position);
				const spriteVisitors = visitors.filter((v) => v._is_sprite === true);
				spriteVisitors.forEach((sprite) => this.level.sprites.remove(sprite));
				break;

		}

	}

	updateInternal(delta) {
		if (this.controls.isDirty()) {

			if (this.controls.mouseCoords.isDirty()) {
				this.onMouseMove();
				if (this.controls.mouseDownLeft) {
					const position = this.getCursorGridPosition(this.controls.mouseCoords);
					this.processClick(position);
				}
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

	getCursorGridPosition(offset) {
		return this.grid.getPosition(this.level.getAbsoluteCoordinates(offset));
	}

	onMouseMove() {
		const mousePosition = this.getCursorGridPosition(this.controls.mouseCoords);

		if (this.lastHighlight !== null) {
			if (this.lastHighlight.distanceTo(mousePosition) === 0) {
				return;
			}
		}

		this.model.highlightedTilePosition.set(mousePosition);
		this.model.highlights.resetChildren();
		const level = Math.round(this.model.brushSize);
		const positions = this.getAffectedPositions(mousePosition, level);
		positions.forEach((p) => this.model.highlights.add(p));
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
