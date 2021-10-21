import GridModel from "./GridModel";
import Vector2 from "../class/Vector2";
import ModelBase from "../class/ModelBase";
import DirtyValue from "../class/DirtyValue";
import PlantModel from "./PlantModel";
import GroundModel from "./GroundModel";
import SpriteModel from "./SpriteModel";
import CollectionModel from "./CollectionModel";
import ResourceModel, {RESOURCE_TYPE_IMAGE} from "./ResourceModel";
import ParallaxModel from "./ParallaxModel";
import BeeModel from "./BeeModel";
import {GROUND_TYPE_WATER} from "../builder/GroundStyle";
import {PARALLAX_HILLS, PARALLAX_STYLES} from "../builder/ParallaxStyle";
import ParallaxLayerModel from "./ParallaxLayerModel";

export default class LevelModel extends ModelBase {
	name;
	grid;
	parallaxType;
	parallax;
	plants;
	bee;
	sprites;
	resources;
	viewBoxScale;
	viewBoxSize;
	viewBoxCoordinates;

	constructor(state) {
		super();

		this.name = 'untitled';
		this.grid = new GridModel();
		this.addChild(this.grid);

		this.plants = new CollectionModel();
		this.addChild(this.plants);

		this.ground = new GroundModel();
		this.addChild(this.ground);

		this.sprites = new CollectionModel();
		this.addChild(this.sprites);

		this.resources = new CollectionModel();
		this.addChild(this.resources);

		this.viewBoxScale = new DirtyValue(1);
		this.addChild(this.viewBoxScale);
		this.viewBoxSize = new Vector2();
		this.addChild(this.viewBoxSize);
		this.viewBoxCoordinates = new Vector2();
		this.addChild(this.viewBoxCoordinates);

		this.parallaxType = new DirtyValue();
		this.addChild(this.parallaxType);
		this.parallaxType.addOnChangeListener((value) => this.setParallaxFromStyle(value));
		this.parallaxType.set(PARALLAX_HILLS);

		// auto recalculate parallax offset
		this.viewBoxChangedHandler = () => this.updateCameraOffset();
		this.viewBoxScale.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxSize.addOnChangeListener(this.viewBoxChangedHandler);
		this.viewBoxCoordinates.addOnChangeListener(this.viewBoxChangedHandler);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			name: this.name,
			grid: this.grid.getState(),
			parallaxType: this.parallaxType.get(),
			plants: this.plants.getState(),
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

		if (state.grid) this.grid.restoreState(state.grid);
		if (state.parallaxType) this.parallaxType.set(state.parallaxType);
		if (state.plants) this.plants.restoreState(state.plants, (p) => new PlantModel(p));
		if (state.ground) this.ground.restoreState(state.ground);
		if (state.bee) this.addBee(new BeeModel(state.bee));
		if (state.sprites) this.sprites.restoreState(state.sprites, (s) => new SpriteModel(s));
		if (state.resources) this.resources.restoreState(state.resources, (r) => new ResourceModel(r));
		if (state.viewBoxScale) this.viewBoxScale.set(state.viewBoxScale);
		if (state.viewBoxSize) this.viewBoxSize.restoreState(state.viewBoxSize);
		if (state.viewBoxCoordinates) this.viewBoxCoordinates.restoreState(state.viewBoxCoordinates);
	}

	addBee(bee) {
		if (this.bee) this.removeChild(this.bee);
		this.bee = bee;
		if (this.bee) {
			this.addChild(this.bee);
		}
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

	isGround(position) {
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_ground === true && v.type !== GROUND_TYPE_WATER && v._is_penetrable === false);
		return visitors.length > 0;
	}

	isWater(position) {
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_ground === true && v.type === GROUND_TYPE_WATER);
		return visitors.length > 0;
	}

	isPenetrable(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_penetrable === false);
		return visitors.length === 0;
	}

	isAir(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		const visitors = this.grid.chessboard.getVisitors(position, (v) => v._is_penetrable === false || v.type === GROUND_TYPE_WATER);
		return visitors.length === 0;
	}

	isCrawlable(position) {
		if (!this.isValidPosition(position)) {
			return false;
		}
		return (!this.isPenetrable(position));
	}

	getAbsoluteCoordinates(offset) {
		return new Vector2(this.viewBoxCoordinates.x + (offset.x * this.viewBoxScale.get()), this.viewBoxCoordinates.y + (offset.y * this.viewBoxScale.get()));
	}

	centerOnCoordinates(coordinates) {
		this.viewBoxCoordinates.setX(coordinates.x - (this.viewBoxScale.get() * this.viewBoxSize.x / 2));
		this.viewBoxCoordinates.setY(coordinates.y - (this.viewBoxScale.get() * this.viewBoxSize.y / 2));
	}

	centerOnPosition(position) {
		this.centerOnCoordinates(this.grid.getCoordinates(position));
	}

	centerView() {
		const center = new Vector2(Math.round(this.level.grid.size.x / 2), Math.round(this.level.grid.size.y / 2));
		this.centerOnPosition(center);
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

	setParallaxFromStyle(parallaxType) {
		const style = PARALLAX_STYLES[parallaxType];
		const parallax = new ParallaxModel();
		parallax.backgroundColor = style.background;
		parallax.backgroundColorEnd = style.backgroundEnd;

		if (style.layers) {
			style.layers.forEach((l) => {
				const layer = new ParallaxLayerModel();
				layer.distance = l.distance;
				this.addResource(RESOURCE_TYPE_IMAGE, l.image.uri, l.image.resource);
				layer.image.path = l.image.uri;
				parallax.addChild(layer);
			});
		}

		this.parallax = parallax;
		this.updateCameraOffset();
		this.makeDirty();
	}

}
