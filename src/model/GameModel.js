import HexGrid from "../class/HexGrid";
import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";

export default class GameModel extends ModelBase {
	grid;
	plant;
	viewBoxScale;
	viewBoxSize;
	viewBoxPosition;
	highlightedTilePosition;

	constructor(state) {
		super(state);

		if (state) {
			this.restoreState(state);
		}
	}

	isDirty() {
		return this.plant.isDirty() || this.viewBoxPosition.isDirty() || this.viewBoxSize.isDirty() || this.viewBoxScale.isDirty() || this.highlightedTilePosition.isDirty();
	}

	getState() {
		return {
			plant: this.plant.getState(),
			viewBoxScale: this.viewBoxScale.get(),
			viewBoxSize: this.viewBoxSize.toArray(),
			viewBoxPosition: this.viewBoxPosition.toArray()
		}
	}

	restoreState(state) {
		this.grid = new HexGrid(new Vector2(100, 100), 80);
		this.plant = new PlantModel();
		this.viewBoxScale = new DirtyValue(1);
		this.viewBoxSize = new Vector2(100, 100);
		this.viewBoxPosition = new Vector2(0, 0);
		this.highlightedTilePosition = new Vector2();
		this.highlightedTilePosition.clean();

		this.plant.restoreState(state.plant);
		this.viewBoxScale.set(state.viewBoxScale);
		this.viewBoxSize.fromArray(state.viewBoxSize);
		this.viewBoxPosition.fromArray(state.viewBoxPosition);
	}

}

