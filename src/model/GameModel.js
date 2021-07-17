import HexGrid from "../class/HexGrid";
import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";
import ButterflyModel from "./ButterflyModel";
import PositionedTreeModel from "./PositionedTreeModel";
import GroundModel from "./GroundModel";

export default class GameModel extends ModelBase {
	grid;
	plant;
	ground;
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
			grid: this.grid.getState(),
			plant: this.plant.getState(),
			ground: this.ground.getState(),
			butterfly: this.butterfly.getState(),
			viewBoxScale: this.viewBoxScale.get(),
			viewBoxSize: this.viewBoxSize.toArray(),
			viewBoxPosition: this.viewBoxPosition.toArray()
		}
	}

	restoreState(state) {
		this.grid = new HexGrid(state.grid);
		this.plant = new PlantModel(state.plant);
		this.ground = new GroundModel(state.ground);
		this.butterfly = new ButterflyModel(state.butterfly);
		this.viewBoxScale = new DirtyValue(state.viewBoxScale);
		this.viewBoxSize = new Vector2();
		this.viewBoxSize.fromArray(state.viewBoxSize);
		this.viewBoxPosition = new Vector2();
		this.viewBoxPosition.fromArray(state.viewBoxPosition);

		this.highlightedTilePosition = new Vector2();
		this.highlightedTilePosition.clean();
	}

}

