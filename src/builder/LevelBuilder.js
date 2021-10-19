import Vector2 from "../class/Vector2";
import LevelModel from "../model/LevelModel";
import GroundBuilder from "./GroundBuilder";
import {RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
import {PARALLAX_STYLES} from "./ParallaxStyle";
import ParallaxLayerModel from "../model/ParallaxLayerModel";
import BeeImage from "../../res/img/bee.svg";
import BeeCrawlImage from "../../res/img/bee-walk.svg";
import BeeWingImage from "../../res/img/wing.svg";
import BeeModel from "../model/BeeModel";
import SpriteModel from "../model/SpriteModel";
import {IMAGE_BEE, IMAGE_BEE_CRAWL, IMAGE_BEE_WING, SPRITE_STYLES} from "./SpriteStyle";
import ParallaxModel from "../model/ParallaxModel";
import {BEE_CENTER} from "../controller/BeeController";

export default class LevelBuilder {
	level;

	constructor(level) {
		if (level) {
			this.level = level;
		} else {
			this.level = new LevelModel();
		}
	}

	setSize(size) {
		this.level.grid.size.set(size);
	}

	setViewBoxSize(size) {
		this.level.viewBoxSize.set(size);
	}

	setTileRadius(size) {
		this.level.grid.tileRadius.set(size);
	}

	setName(name) {
		this.level.name = name;
	}

	setViewBoxScale(scale) {
		this.level.viewBoxScale.set(scale);
	}

	setStart(position) {
		this.level.centerOnPosition(position);
	}

	generateGround(preset = null) {
		const startPosition = new Vector2(Math.round(this.level.grid.size.x / 2), Math.round(this.level.grid.size.y / 2));

		const builder = new GroundBuilder(this.level.grid);
		if (preset) {
			builder.generateFromPreset(startPosition, preset);
		} else {
			builder.generateRandom(startPosition);
		}
		this.ground = builder.build();
	}

	addSprite(position, strategy, data, path, scale, rotation, flipped) {
		const state = {
			position: position.toArray(),
			image: (path) ? {
				scale: scale,
				flipped: flipped,
				rotation: rotation,
				path: path
			} : null,
			strategy: strategy,
			data: data
		};
		return this.level.sprites.add(new SpriteModel(state));
	}

	addSpriteFromStyle(position, spriteType) {
		const style = SPRITE_STYLES[spriteType];
		let uri = null;
		let scale = 1;
		if (style.image) {
			this.level.addResource(RESOURCE_TYPE_IMAGE, style.image.uri, style.image.resource);
			uri = style.image.uri;
			scale = style.image.scale;
		}
		return this.addSprite(
			position,
			style.strategy,
			style.data,
			uri,
			scale,
			0,
			false
		);
	}

	addTile(position, groundType) {
		this.level.ground.addTile({position: position.toArray(), type: groundType});
	}

	addTileFromStyle(position, groundType) {
		this.addTile(position, groundType);
	}

	addBee(position) {
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE, BeeImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_CRAWL, BeeCrawlImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_WING, BeeWingImage);
		this.level.addBee(
			new BeeModel({
				direction: [0,0],
				speed: 0,
				position: position.toArray(),
				image: {
					coordinates: BEE_CENTER.clone(),
					scale: 1,
					flipped: false,
					rotation: 0,
					path: IMAGE_BEE
				},
				imageCrawl: {
					coordinates: BEE_CENTER.clone(),
					scale: 1,
					flipped: false,
					rotation: 0,
					path: IMAGE_BEE_CRAWL
				},
				leftWing: {
					coordinates: BEE_CENTER.clone(),
					scale: 1,
					flipped: false,
					rotation: 0,
					path: IMAGE_BEE_WING
				},
				rightWing: {
					coordinates: BEE_CENTER.clone(),
					scale: 1,
					flipped: true,
					rotation: 0,
					path: IMAGE_BEE_WING
				},
			})
		);
	}

	build() {
		return this.level;
	}

}
