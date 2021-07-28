import Vector2 from "../class/Vector2";
import {} from "@svgdotjs/svg.filter.js"
import LivingTreeModel from "../model/LivingTreeModel";
import ControllerBase from "./ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";
import PlantController from "./PlantController";

const GUTTER_WIDTH = 150;

export default class LevelController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.plantController = new PlantController(game, model.plant, controls);
		this.addChild(this.plantController);

		this.spritesController = new SpriteCollectionController(game, model.sprites, controls);
		this.addChild(this.spritesController);

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
	}

	getCursorAbsoluteCoordinates(offset) {
		return new Vector2(this.model.viewBoxCoordinates.x + (offset.x * this.model.viewBoxScale.get()), this.model.viewBoxCoordinates.y + (offset.y * this.model.viewBoxScale.get()));
	}

	getCursorGridPosition(offset) {
		return this.model.grid.getPosition(this.getCursorAbsoluteCoordinates(offset));
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
			this.model.sanitizeViewBox();
		}
	}

	onZoom() {
		const before = this.getCursorAbsoluteCoordinates(this.controls.mouseCoords);
		const delta = (this.model.viewBoxScale.get() / 10) * this.controls.zoom.get();
		this.model.viewBoxScale.set(Math.max( 0.1, Math.min(100, this.model.viewBoxScale.get() + delta)));

		const after = this.getCursorAbsoluteCoordinates(this.controls.mouseCoords);
		const diff = after.subtract(before);
		this.model.viewBoxCoordinates.set(this.model.viewBoxCoordinates.x - diff.x, this.model.viewBoxCoordinates.y - diff.y);

		this.model.sanitizeViewBox();
	}

}
