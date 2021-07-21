import HexGridModel from "./HexGridModel";
import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";
import GroundModel from "./GroundModel";
import SpriteModel from "./SpriteModel";
import Collection from "../class/Collection";

export default class LevelModel extends ModelBase {
	grid;
	plant;
	sprites;
	viewBoxScale;
	viewBoxSize;
	viewBoxCoordinates;
	highlightedTilePosition;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			grid: this.grid.getState(),
			plant: this.plant.getState(),
			ground: this.ground.getState(),
			sprites: this.sprites.getState(),
			viewBoxScale: this.viewBoxScale.get(),
			viewBoxSize: this.viewBoxSize.toArray(),
			viewBoxCoordinates: this.viewBoxCoordinates.toArray()
		}
	}

	restoreState(state) {
		this.grid = new HexGridModel(state.grid);
		this.plant = new PlantModel(state.plant);
		this.addChild(this.plant);
		this.ground = new GroundModel(state.ground);
		this.addChild(this.ground);
		this.sprites = new Collection();
		this.sprites.restoreState(state.sprites, (s) => new SpriteModel(s));
		this.addChild(this.sprites);

		this.viewBoxScale = new DirtyValue(state.viewBoxScale);
		this.addChild(this.viewBoxScale);
		this.viewBoxSize = new Vector2();
		this.viewBoxSize.fromArray(state.viewBoxSize);
		this.addChild(this.viewBoxSize);
		this.viewBoxCoordinates = new Vector2();
		this.viewBoxCoordinates.fromArray(state.viewBoxCoordinates);
		this.addChild(this.viewBoxCoordinates);

		this.highlightedTilePosition = new Vector2();
		this.highlightedTilePosition.clean();
		this.addChild(this.highlightedTilePosition);
	}

}

