import Grid from "./Grid";
import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import RootsModel from "./RootsModel";
import DirtyValue from "../class/DirtyValue";

export default class GameModel extends ModelBase {
	grid;
	roots;
	viewBoxScale;
	viewBoxSize;
	viewBoxPosition;
	highlightedTilePosition;

	constructor() {
		super();
		this.grid = new Grid(new Vector2(100, 100), new Vector2(120, 80));
		this.roots = new RootsModel(new Vector2(15, 15));
		this.roots.restoreState(null);
		this.viewBoxScale = new DirtyValue(1);
		this.viewBoxSize = new Vector2(100, 100);
		this.viewBoxPosition = new Vector2(250, 150);
		this.highlightedTilePosition = new Vector2();
	}

	isDirty() {
		return this.roots.isDirty() || this.viewBoxPosition.isDirty() || this.viewBoxSize.isDirty() || this.viewBoxScale.isDirty() || this.highlightedTilePosition.isDirty();
	}
}

