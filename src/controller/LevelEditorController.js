import ControllerBase from "./ControllerBase";
import {GROUND_TYPE_BASIC, GROUND_TYPE_EMPTY} from "../model/GroundTileModel";

export default class LevelEditorController extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

		this.lastMouseCoords = null;
	}

	activateInternal() {
		this.controls.mouseClick = null;
	}

	addGroundTile(position) {
		const visitors = this.chessboard.getTile(position);
		console.log(visitors);
		const groundVisitors = visitors.filter((v) => v._is_ground === true);
		if (groundVisitors.length === 0) {
			const groundType = this.model.selectedGroundType;
			if (groundType !== GROUND_TYPE_EMPTY) {
				this.level.ground.addTile({position: position.toArray(), type: groundType});
			}
			console.log('Tile added');
		} else {
			if (this.model.selectedGroundType === GROUND_TYPE_EMPTY) {
				this.level.ground.removeTile(groundVisitors[0]);
			}
		}
	}

	updateInternal(delta) {
		if (this.controls.isDirty()) {
			if (this.controls.mouseCoords.isDirty()) {
				this.onMouseMove();
				if (this.controls.mouseDownLeft) {
					const position = this.getCursorGridPosition(this.controls.mouseCoords);
					this.addGroundTile(position);
				}
				this.controls.mouseCoords.clean();
			}
			if (this.controls.mouseClick && this.controls.mouseClick.isDirty()) {
				const position = this.getCursorGridPosition(this.controls.mouseClick);
				if (this.controls.mouseClickLeft) {
					this.addGroundTile(position);
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
		this.level.highlightedTilePosition.set(mousePosition);
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
