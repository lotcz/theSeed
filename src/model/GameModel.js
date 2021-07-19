import HexGrid from "../class/HexGrid";
import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";
import ImageModel from "./ImageModel";
import PositionedTreeModel from "./PositionedTreeModel";
import GroundModel from "./GroundModel";

export default class GameModel extends ModelBase {
	grid;
	plant;
	ground;
	viewBoxScale;
	viewBoxSize;
	viewBoxCoordinates;
	highlightedTilePosition;

	constructor(state) {
		super(state);

		if (state) {
			this.restoreState(state);
		}
	}

	isDirty() {
		return this.plant.isDirty() || this.ladybug.isDirty() || this.viewBoxCoordinates.isDirty() || this.viewBoxSize.isDirty() || this.viewBoxScale.isDirty() || this.highlightedTilePosition.isDirty();
	}

	getState() {
		return {
			grid: this.grid.getState(),
			plant: this.plant.getState(),
			ground: this.ground.getState(),
			butterfly: this.butterfly.getState(),
			ladybug: this.ladybug.getState(),
			bug1: this.bug1.getState(),
			beetle: this.beetle.getState(),
			coccinelle: this.coccinelle.getState(),
			viewBoxScale: this.viewBoxScale.get(),
			viewBoxSize: this.viewBoxSize.toArray(),
			viewBoxCoordinates: this.viewBoxCoordinates.toArray()
		}
	}

	restoreState(state) {
		this.grid = new HexGrid(state.grid);
		this.plant = new PlantModel(state.plant);
		this.ground = new GroundModel(state.ground);
		this.butterfly = new ImageModel(state.butterfly);
		this.ladybug = new ImageModel(state.ladybug);
		this.bug1 = new ImageModel(state.bug1);
		this.beetle = new ImageModel(state.beetle);
		this.coccinelle = new ImageModel(state.coccinelle);
		this.viewBoxScale = new DirtyValue(state.viewBoxScale);
		this.viewBoxSize = new Vector2();
		this.viewBoxSize.fromArray(state.viewBoxSize);
		this.viewBoxCoordinates = new Vector2();
		this.viewBoxCoordinates.fromArray(state.viewBoxCoordinates);

		this.highlightedTilePosition = new Vector2();
		this.highlightedTilePosition.clean();
	}

}

