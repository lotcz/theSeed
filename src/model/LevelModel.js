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
import BeeModel from "./BeeModel";

export default class LevelModel extends ModelBase {
	name;
	grid;
	parallax;
	plant;
	bee;
	sprites;
	resources;
	viewBoxScale;
	viewBoxSize;
	viewBoxCoordinates;

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
			bee: this.bee ? this.bee.getState() : null
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
		if (state.bee) {
			this.bee = new BeeModel(state.bee);
			this.addChild(this.bee);
		}
		this.sprites = new CollectionModel();
		if (state.sprites) {
			this.sprites.restoreState(state.sprites, (s) => new SpriteModel(s));
		}
		this.addChild(this.sprites);

		this.resources = new CollectionModel(state.resources, (r) => new ResourceModel(r));
		this.addChild(this.resources);

		this.viewBoxScale = new DirtyValue(state.viewBoxScale);
		this.addChild(this.viewBoxScale);
		this.viewBoxSize = Vector2.fromArray(state.viewBoxSize);
		this.addChild(this.viewBoxSize);
		this.viewBoxCoordinates = Vector2.fromArray(state.viewBoxCoordinates);
		this.addChild(this.viewBoxCoordinates);

		// auto recalculate parallax offset
		this.viewBoxScale.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxSize.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxCoordinates.addOnChangeListener(this.viewBoxChangedHandler);
		this.updateCameraOffset();
	}

	addResource(resType, uri, data) {
		const existing = this.resources.children.filter((r) => r.uri === uri);
		if (existing.length > 0) {
			console.log(`Resource URI ${uri} already exists.`);
		} else {
			this.resources.add(new ResourceModel({resType: resType, uri: uri, data: data}));
		}
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

	isGround(position) {
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_ground === true);
		return visitors.length > 0;
	}

	isPenetrable(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_penetrable === false);
		return visitors.length === 0;
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
