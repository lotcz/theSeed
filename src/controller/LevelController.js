import Vector2 from "../class/Vector2";
import LivingTreeModel from "../model/LivingTreeModel";
import ControllerBase from "./ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";
import PlantController from "./PlantController";
import {STRATEGY_WATER} from "./SpriteController";
import AutoPlantController from "./AutoPlantController";

const GUTTER_WIDTH = 150;

export default class LevelController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		if (model.plant.auto) {
			this.plantController = new AutoPlantController(game, model.plant, controls);
		} else {
			this.plantController = new PlantController(game, model.plant, controls);
		}
		this.addChild(this.plantController);

		this.spritesController = new SpriteCollectionController(game, model.sprites, controls);
		this.addChild(this.spritesController);

		this.lastMouseCoords = null;
	}

	updateInternal(delta) {

		if (this.controls.isDirty()) {
			if (this.controls.mouseCoords.isDirty()) {
				this.onMouseMove();
				this.controls.mouseCoords.clean();
			}
			if (this.controls.mouseClick && this.controls.mouseClick.isDirty()) {
				const position = this.getCursorGridPosition(this.controls.mouseClick);
				this.plantController.onClick(position);

				const visitors = this.model.grid.chessboard.getTile(position);
				const water = visitors.filter((v) => v.strategy !== undefined && v.strategy.get() === STRATEGY_WATER);
				water.forEach((w) => this.model.inventory.water.set(this.model.inventory.water.get() + w.data.amount));

				this.controls.mouseClick.clean();
			}
			if (this.controls.zoom.isDirty()) {
				this.onZoom();
				this.controls.resetZoom();
			}
			this.controls.clean();
		}

		//if (this.controls.mouseOver) {
			this.scroll(delta);
		//}
	}

	getCursorGridPosition(offset) {
		return this.model.grid.getPosition(this.model.getAbsoluteCoordinates(offset));
	}

	onMouseMove() {
		const mousePosition = this.getCursorGridPosition(this.controls.mouseCoords);
		this.model.highlightedTilePosition.set(mousePosition);
	}

	scroll(delta) {
		const speed = this.model.viewBoxScale.get(); //delta / 100;

		if (this.controls.mouseDownLeft) {
			if (this.lastMouseCoords !== null) {
				const diff = this.lastMouseCoords.subtract(this.controls.mouseCoords);
				this.model.viewBoxCoordinates.set(this.model.viewBoxCoordinates.x + (diff.x * speed), this.model.viewBoxCoordinates.y + (diff.y * speed));
				this.model.sanitizeViewBox();
				this.updateCameraOffset();
			}
			this.lastMouseCoords = this.controls.mouseCoords;
		} else {
			this.lastMouseCoords = null;

			const scrolling = new Vector2();
/*
			const mouseCoords = this.controls.mouseCoords;

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

 */

			if (!this.model.inventory) {
				//scrolling.setX(-2);
			}

			if (scrolling.size() > 0) {
				this.model.viewBoxCoordinates.set(this.model.viewBoxCoordinates.x + (scrolling.x * speed), this.model.viewBoxCoordinates.y + (scrolling.y * speed));
				this.model.sanitizeViewBox();
				this.updateCameraOffset();
			}

		}

	}

	updateCameraOffset() {
		const cameraCoordinates = this.model.viewBoxCoordinates.add(this.model.viewBoxSize.multiply(0.5).multiply(this.model.viewBoxScale.get()));
		const center = this.model.grid.getMaxCoordinates().multiply(0.5);
		const cameraOffset = cameraCoordinates.subtract(center);
		this.model.parallax.cameraOffset.set(cameraOffset);
	}

	onZoom() {
		const zoomIn = this.controls.zoom.get() < 0;
		const delta = (this.model.viewBoxScale.get() / 10) * this.controls.zoom.get();
		const before = this.model.getAbsoluteCoordinates(zoomIn ? this.controls.mouseCoords : this.model.viewBoxSize.multiply(0.5));

		this.model.viewBoxScale.set(Math.max( 0.1, Math.min(100, this.model.viewBoxScale.get() + delta)));

		const after = this.model.getAbsoluteCoordinates(zoomIn ? this.controls.mouseCoords : this.model.viewBoxSize.multiply(0.5));
		const diff = after.subtract(before);
		this.model.viewBoxCoordinates.set(this.model.viewBoxCoordinates.x - diff.x, this.model.viewBoxCoordinates.y - diff.y);

		this.model.sanitizeViewBox();
		this.updateCameraOffset();
	}

}
