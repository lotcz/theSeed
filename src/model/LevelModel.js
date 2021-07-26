import GridModel from "./GridModel";
import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";
import GroundModel from "./GroundModel";
import SpriteModel from "./SpriteModel";
import CollectionModel from "./CollectionModel";
import ResourceModel from "./ResourceModel";

export default class LevelModel extends ModelBase {
	grid;
	plant;
	sprites;
	resources;
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
			resources: this.resources.getState(),
			viewBoxScale: this.viewBoxScale.get(),
			viewBoxSize: this.viewBoxSize.toArray(),
			viewBoxCoordinates: this.viewBoxCoordinates.toArray()
		}
	}

	restoreState(state) {
		this.grid = new GridModel(state.grid);
		this.plant = new PlantModel(state.plant);
		this.addChild(this.plant);
		this.ground = new GroundModel(state.ground);
		this.addChild(this.ground);
		this.sprites = new CollectionModel();
		this.sprites.restoreState(state.sprites, (s) => new SpriteModel(s));
		this.addChild(this.sprites);

		this.resources = new ResourceModel(state.resources);
		this.addChild(this.resources);

		this.viewBoxScale = new DirtyValue(state.viewBoxScale);
		this.addChild(this.viewBoxScale);
		this.viewBoxSize = Vector2.fromArray(state.viewBoxSize);
		this.addChild(this.viewBoxSize);
		this.viewBoxCoordinates = Vector2.fromArray(state.viewBoxCoordinates);
		this.addChild(this.viewBoxCoordinates);

		this.highlightedTilePosition = new Vector2();
		this.highlightedTilePosition.clean();
		this.addChild(this.highlightedTilePosition);
	}

	isValidPosition(position) {
		return this.grid.isValidPosition(position);
	}

	getGroundY(x) {
		return this.ground.points[x].y;
	}

	isGround(position) {
		return position.y === this.getGroundY(position.x);
	}

	isAboveGround(position) {
		return position.y < this.getGroundY(position.x);
	}

	isUnderGround(position) {
		return position.y > this.getGroundY(position.x);
	}

}

