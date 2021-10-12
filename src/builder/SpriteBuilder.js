import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import ResourceModel, {RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";

import SpriteModel from "../model/SpriteModel";
import BeeModel from "../model/BeeModel";

import WaterImage from "../../res/img/water.svg";
import NitrogenImage from "../../res/img/nitrogen.svg";
import CalciumImage from "../../res/img/calcium.svg";
import PhosphorusImage from "../../res/img/phosphorus.svg";
import PotassiumImage from "../../res/img/potassium.svg";
import SulfurImage from "../../res/img/sulfur.svg";
import MagnesiumImage from "../../res/img/magnesium.svg";

import ButterflyImage from "../../res/img/butterfly.svg";
import LadybugImage from "../../res/img/my-lady-bug.svg";
import GrasshopperImage from "../../res/img/grasshopper.svg";
import WormHeadImage from "../../res/img/worm-head.svg";
import WormBodyImage from "../../res/img/worm-body.svg";
import WormButtImage from "../../res/img/worm-butt.svg";

export const IMAGE_WATER = 'img/water.svg';
export const IMAGE_NITROGEN = 'img/nitrogen.svg';
export const IMAGE_POTASSIUM = 'img/potassium.svg';
export const IMAGE_SULFUR = 'img/sulfur.svg';
export const IMAGE_CALCIUM = 'img/calcium.svg';
export const IMAGE_MAGNESIUM = 'img/magnesium.svg';
export const IMAGE_PHOSPHORUS = 'img/phosphorus.svg';

export const IMAGE_BUG = 'img/ladybug.svg';
export const IMAGE_BUTTERFLY = 'img/butterfly.svg';
export const IMAGE_GRASSHOPPER = 'img/grasshopper.svg';
export const IMAGE_WORM_HEAD = 'img/worm-head.svg';
export const IMAGE_WORM_BODY = 'img/worm-body.svg';
export const IMAGE_WORM_BUTT = 'img/worm-butt.svg';

import {
	STRATEGY_BUG,
	STRATEGY_BUTTERFLY,
	STRATEGY_MINERAL,
	STRATEGY_TURNER,
	STRATEGY_WATER,
	STRATEGY_WORM
} from "../controller/SpriteController";


import BeeImage from "../../res/img/bee.svg";
export const IMAGE_BEE = 'img/bee.svg';

export default class SpriteBuilder {
	level;

	constructor(level) {
		this.level = level;
	}

	getRandomPosition(underGround) {
		if (underGround) {
			if (this.level.ground.tiles.children.length > 0) {
				return Pixies.randomElement(this.level.ground.tiles.children).position;
			}
		}

		const max = this.level.grid.getMaxPosition();
		let position = null;
		do {
			position = new Vector2(Pixies.randomIndex(max.x), Pixies.randomIndex(max.y));
		} while (this.level.isGround(position));
		return position;

	}

	addSprite(position, scale, flipped, rotation, path, strategy, data) {
		const state = {
			position: position.toArray(),
			image: {
				scale: scale,
				flipped: flipped,
				rotation: rotation,
				path: path
			},
			strategy: strategy,
			data: data
		};
		return this.level.sprites.add(new SpriteModel(state));
	}

	addBugs() {
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BUG, LadybugImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BUTTERFLY, ButterflyImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WORM_HEAD, WormHeadImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WORM_BODY, WormBodyImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WORM_BUTT, WormButtImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_GRASSHOPPER, GrasshopperImage);

		const bugCount = 10;
		for (let i = 0, max = bugCount; i < max; i++) {
			this.addSprite(
				this.getRandomPosition(false),
				0.2 + (Math.random() * 2),
				false,
				0,
				IMAGE_BUG,
				STRATEGY_BUG
			);
		}

		const fliesCount = 10;
		for (let i = 0, max = fliesCount; i < max; i++) {
			this.addSprite(
				this.getRandomPosition(false),
				0.5 + Math.random(),
				false,
				0,
				IMAGE_BUTTERFLY,
				STRATEGY_BUTTERFLY
			);
		}

		const wormsCount = 0;
		for (let i = 0, max = wormsCount; i < max; i++) {
			this.addSprite(
				this.getRandomPosition(true),
				0.5 + Math.random(),
				false,
				0,
				IMAGE_WORM_HEAD,
				STRATEGY_WORM
			);
		}

		const grasshoppersCount = 0;
		for (let i = 0, max = grasshoppersCount; i < max; i++) {
			this.addSprite(
				this.getRandomPosition(false),
				0.5 + Math.random(),
				false,
				0,
				IMAGE_GRASSHOPPER,
				STRATEGY_BUTTERFLY
			);
		}
	}

	addWater() {
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WATER, WaterImage);

		const waterDensity = 0.01;
		const max = this.level.grid.getMaxPosition();
		for (let i = 0; i <= max.x; i++) {
			const limit = max.y;
			const amount = Math.ceil(limit * waterDensity);

			for (let ii = 0; ii < amount; ii++) {
				this.addSprite(
					this.getRandomPosition(false),
					1,
					false,
					0,
					IMAGE_WATER,
					STRATEGY_WATER,
					{amount: 0.3 + 0.7 * Math.random() }
				);
			}
		}
	}

	addMinerals() {
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_NITROGEN, NitrogenImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_SULFUR, SulfurImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_MAGNESIUM, MagnesiumImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_CALCIUM, CalciumImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_PHOSPHORUS, PhosphorusImage);
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_POTASSIUM, PotassiumImage);

		const nutrients = [IMAGE_NITROGEN, IMAGE_SULFUR, IMAGE_MAGNESIUM, IMAGE_CALCIUM, IMAGE_PHOSPHORUS, IMAGE_POTASSIUM];

		const mineralsDensity = 0.01;
		const max = this.level.grid.getMaxPosition();
		for (let i = 0; i <= max.x; i++) {
			const limit = this.level.ground.tiles.children.length;
			const amount = Math.ceil(limit * mineralsDensity);

			for (let ii = 0; ii < amount; ii++) {
				this.addSprite(
					this.getRandomPosition(true),
					1,
					false,
					0,
					Pixies.randomElement(nutrients),
					STRATEGY_MINERAL,
					{amount: 0.3 + 0.7 * Math.random() }
				);
			}
		}
	}

	addNutrients() {
		this.addWater();
		this.addMinerals()
	}

	addTurner() {
		const turner = {
			position: [0, 0],
			image: {
				scale: 1,
				flipped: false,
				rotation: 0,
				path: IMAGE_BUG
			},
			strategy: STRATEGY_TURNER
		};
		this.level.sprites.add(new SpriteModel(turner));
	}

	addBee(position) {
		this.level.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE, BeeImage);
		this.level.bee = new BeeModel({
			direction: [0,0],
			speed: 0,
			position: position.toArray(),
			image: {
				scale: 1,
				flipped: false,
				rotation: 0,
				path: IMAGE_BEE
			},
		})
	}

}
