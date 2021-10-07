import GridModel from "./GridModel";
import Vector2 from "../class/Vector2";
import ModelBase from "./ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";
import GroundModel from "./GroundModel";
import SpriteModel from "./SpriteModel";
import CollectionModel from "./CollectionModel";
import ResourceModel from "./ResourceModel";
import ParallaxModel from "./ParallaxModel";
import InventoryModel from "./InventoryModel";

export default class LevelModel extends ModelBase {
	name;
	grid;
	parallax;
	plant;
	sprites;
	resources;
	viewBoxScale;
	viewBoxSize;
	viewBoxCoordinates;
	highlightedTilePosition;
	inventory;

	constructor(state) {
		super();

		this.viewBoxChangedHandler = () => this.updateCameraOffset();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			name: this.name,
			grid: this.grid.getState(),
			parallax: this.parallax.getState(),
			plant: this.plant.getState(),
			ground: this.ground.getState(),
			sprites: this.sprites.getState(),
			resources: this.resources.getState(),
			viewBoxScale: this.viewBoxScale.get(),
			viewBoxSize: this.viewBoxSize.toArray(),
			viewBoxCoordinates: this.viewBoxCoordinates.toArray(),
			inventory: this.inventory.getState()
		}
	}

	restoreState(state) {
		this.name = state.name;
		this.grid = new GridModel(state.grid);
		this.parallax = new ParallaxModel(state.parallax);
		//this.addChild(this.parallax); no need for this
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

		this.inventory = new InventoryModel(state.inventory);
		this.addChild(this.inventory);

		this.highlightedTilePosition = new Vector2();
		this.highlightedTilePosition.clean();
		this.addChild(this.highlightedTilePosition);

		// auto recalculate parallax offset
		this.viewBoxScale.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxSize.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxCoordinates.addOnChangeListener(this.viewBoxChangedHandler);
		this.updateCameraOffset();
	}

	isPositionInView(position) {
		const coords = this.grid.getCoordinates(position);
		return this.isCoordinateInView(coords);
	}

	isCoordinateInView(coords) {
		const min = this.viewBoxCoordinates.clone();
		const max = min.add(this.viewBoxSize.multiply(this.viewBoxScale.get()));
		return coords.x >= (min.x - this.grid.tileSize.x) && coords.x <= (max.x + this.grid.tileSize.x) && coords.y >= (min.y - this.grid.tileSize.y) && coords.y <= (max.y + this.grid.tileSize.y);
	}

	isValidPosition(position) {
		return this.grid.isValidPosition(position);
	}

	getAbsoluteCoordinates(offset) {
		return new Vector2(this.viewBoxCoordinates.x + (offset.x * this.viewBoxScale.get()), this.viewBoxCoordinates.y + (offset.y * this.viewBoxScale.get()));
	}

	centerOnCoordinates(coordinates) {
		this.viewBoxCoordinates.setX(coordinates.x - (this.viewBoxScale.get() * this.viewBoxSize.x / 2));
		this.viewBoxCoordinates.setY(coordinates.y - (this.viewBoxScale.get() * this.viewBoxSize.y / 2));
	}

	getGroundY(x) {
		if (!this.ground.points[x]) {
			return null;
		}
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

	sanitizeViewBox() {
		const max = this.grid.getMaxCoordinates();
		if ((this.viewBoxSize.x * this.viewBoxScale.get()) > max.x) {
			this.viewBoxScale.set(max.x / this.viewBoxSize.x);
		}
		if ((this.viewBoxSize.y * this.viewBoxScale.get()) > max.y) {
			const before = this.getAbsoluteCoordinates(this.viewBoxSize.multiply(0.5));

			this.viewBoxScale.set(max.y / this.viewBoxSize.y);

			const after = this.getAbsoluteCoordinates(this.viewBoxSize.multiply(0.5));
			const diff = after.subtract(before);
			this.viewBoxCoordinates.set(this.viewBoxCoordinates.x - diff.x, this.viewBoxCoordinates.y - diff.y);

		}
		if (this.viewBoxCoordinates.x < 0) {
			this.viewBoxCoordinates.setX(0);
		}
		const maxX = max.x - (this.viewBoxSize.x * this.viewBoxScale.get());
		if (this.viewBoxCoordinates.x > maxX) {
			this.viewBoxCoordinates.setX(maxX);
		}
		if (this.viewBoxCoordinates.y < 0) {
			this.viewBoxCoordinates.setY(0);
		}
		const maxY = max.y - (this.viewBoxSize.y * this.viewBoxScale.get());
		if (this.viewBoxCoordinates.y > maxY) {
			this.viewBoxCoordinates.setY(maxY);
		}
	}

	updateCameraOffset() {
		const cameraCoordinates = this.viewBoxCoordinates.add(this.viewBoxSize.multiply(0.5).multiply(this.viewBoxScale.get()));
		const center = this.grid.getMaxCoordinates().multiply(0.5);
		const cameraOffset = cameraCoordinates.subtract(center);
		this.parallax.cameraOffset.set(cameraOffset);
	}

}
