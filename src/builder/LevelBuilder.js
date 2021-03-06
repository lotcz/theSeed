import Vector2 from "../class/Vector2";
import LevelModel from "../model/LevelModel";
import GroundBuilder from "./GroundBuilder";

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
		const ground = builder.build();
		this.level.ground.restoreState(ground.getState());
	}

	addSprite(position, strategy, data, path, scale, rotation, flipped, oriented) {
		return this.level.addSprite(position, strategy, data, path, scale, rotation, flipped, oriented);
	}

	addSpriteFromStyle(position, spriteType) {
		return this.level.addSpriteFromStyle(position, spriteType);
	}

	addTile(position, groundType) {
		this.level.ground.addTile({position: position.toArray(), type: groundType});
	}

	addTileFromStyle(position, groundType) {
		this.addTile(position, groundType);
	}

	addBee(position) {
		const bee = this.level.createBee(position);
		return this.level.addBee(bee);
	}

	build() {
		return this.level;
	}

}
