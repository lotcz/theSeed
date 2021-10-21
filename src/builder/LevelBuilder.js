import Vector2 from "../class/Vector2";
import LevelModel from "../model/LevelModel";
import GroundBuilder from "./GroundBuilder";
import {RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";

import BeeImage from "../../res/img/bee.svg";
import BeeDeadImage from "../../res/img/bee-dead.svg";
import BeeCrawlImage from "../../res/img/bee-walk.svg";
import BeeWingImage from "../../res/img/wing.svg";
import Stars1Image from "../../res/img/stars-1.svg";
import Stars2Image from "../../res/img/stars-2.svg";
import Stars3Image from "../../res/img/stars-3.svg";

import BeeModel from "../model/BeeModel";
import SpriteModel from "../model/SpriteModel";
import {
	IMAGE_BEE,
	IMAGE_BEE_DEAD,
	IMAGE_BEE_CRAWL,
	IMAGE_BEE_WING,
	SPRITE_STYLES,
	IMAGE_STARS_1,
	IMAGE_STARS_2,
	IMAGE_STARS_3
} from "./SpriteStyle";
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
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_DEAD, BeeDeadImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_CRAWL, BeeCrawlImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_WING, BeeWingImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_1, Stars1Image);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_2, Stars2Image);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_3, Stars3Image);

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
				deadImagePath: IMAGE_BEE_DEAD,
				crawlingAnimation: {
					image: {
						coordinates: BEE_CENTER.clone(),
						scale: 1,
						flipped: false,
						rotation: 0,
						path: IMAGE_BEE_CRAWL
					},
					paths: [IMAGE_BEE_CRAWL, IMAGE_BEE]
				},
				starsAnimation: {
					image: {
						coordinates: BEE_CENTER.clone(),
						scale: 1,
						flipped: false,
						rotation: 0,
						path: IMAGE_STARS_1
					},
					paths: [IMAGE_STARS_1, IMAGE_STARS_2, IMAGE_STARS_3]
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
