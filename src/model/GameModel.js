import HexGrid from "./HexGrid";
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

	constructor() {
		super();
		this.grid = new HexGrid(new Vector2(100, 100), 80);
		this.plant = new PlantModel(new Vector2(15, 15));
		this.plant.restoreState(null);
		this.viewBoxScale = new DirtyValue(1);
		this.viewBoxSize = new Vector2(100, 100);
		this.viewBoxPosition = new Vector2(250, 150);
		this.highlightedTilePosition = new Vector2();
	}

	isDirty() {
		return this.plant.isDirty() || this.viewBoxPosition.isDirty() || this.viewBoxSize.isDirty() || this.viewBoxScale.isDirty() || this.highlightedTilePosition.isDirty();
	}
}

