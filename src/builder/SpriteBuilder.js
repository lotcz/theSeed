import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import ResourceModel, {RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
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
import SpriteModel from "../model/SpriteModel";
import {
	STRATEGY_BUG,
	STRATEGY_BUTTERFLY,
	STRATEGY_TURNER,
	STRATEGY_WATER,
	STRATEGY_WORM
} from "../controller/SpriteController";

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

export default class SpriteBuilder {
	level;

	constructor(level) {
		this.level = level;
	}

	addResource(resType, uri, data) {
		this.level.resources.addChild(new ResourceModel({resType: resType, uri: uri, data: data}));
	}

	getRandomPosition(under) {
		const max = this.level.grid.getMaxPosition();
		const x = Pixies.randomIndex(max.x);
		const groundY = this.level.getGroundY(x);

		if (under)
			return new Vector2(x, groundY + 1 + Pixies.randomIndex(max.y - groundY));
		else
			return new Vector2(x, groundY - 1 - Pixies.randomIndex(groundY));
	}

	addBugs() {
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BUG, LadybugImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BUTTERFLY, ButterflyImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WORM_HEAD, WormHeadImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WORM_BODY, WormBodyImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WORM_BUTT, WormButtImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_GRASSHOPPER, GrasshopperImage);

		const bugCount = 10;
		for (let i = 0, max = bugCount; i < max; i++) {
			const state = {
				image: {
					position: [0, 0],
					scale: 0.2 + (Math.random() * 2),
					flipped: (0.5 > Math.random()),
					rotation: 0,
					path: IMAGE_BUG
				},
				data: {
					gi: Pixies.randomIndex(this.level.ground.points.length)
				},
				strategy: STRATEGY_BUG
			};
			this.level.sprites.add(new SpriteModel(state));
		}

		const fliesCount = 10;
		for (let i = 0, max = fliesCount; i < max; i++) {
			const state = {
				image: {
					position: this.getRandomPosition(false).toArray(),
					scale: 0.5 + Math.random(),
					flipped: false,
					rotation: 0,
					path: IMAGE_BUTTERFLY
				},
				strategy: STRATEGY_BUTTERFLY
			};
			this.level.sprites.add(new SpriteModel(state));
		}

		const wormsCount = 5;
		for (let i = 0, max = wormsCount; i < max; i++) {
			this.addSprite(
				this.getRandomPosition(true),
				0.5 + Math.random(),
				false,
				0,
				IMAGE_WORM_HEAD,
				STRATEGY_WORM,
				{}
			);
		}

		const grasshoppersCount = 5;
		for (let i = 0, max = grasshoppersCount; i < max; i++) {
			this.addSprite(
				this.getRandomPosition(false),
				0.5 + Math.random(),
				false,
				0,
				IMAGE_GRASSHOPPER,
				STRATEGY_BUTTERFLY,
				{}
			);
		}
	}

	addSprite(position, scale, flipped, rotation, path, strategy, data) {
		const state = {
			image: {
				position: position.toArray(),
				scale: scale,
				flipped: false,
				rotation: 0,
				path: path
			},
			strategy: strategy,
			data: data
		};
		return this.level.sprites.add(new SpriteModel(state));
	}

	addNutrients() {
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_WATER, WaterImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_NITROGEN, NitrogenImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_SULFUR, SulfurImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_MAGNESIUM, MagnesiumImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_CALCIUM, CalciumImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_PHOSPHORUS, PhosphorusImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_POTASSIUM, PotassiumImage);

		const nutrients = [IMAGE_WATER, IMAGE_NITROGEN, IMAGE_SULFUR, IMAGE_MAGNESIUM, IMAGE_CALCIUM, IMAGE_PHOSPHORUS, IMAGE_POTASSIUM];

		const waterDensity = 0.02;
		const max = this.level.grid.getMaxPosition();
		for (let i = 0; i <= max.x; i++) {
			const groundY = this.level.getGroundY(i);
			const limit = max.y - groundY;
			const amount = Math.ceil(limit * waterDensity);

			for (let ii = 0; ii < amount; ii++) {
				const state = {
					image: {
						position: [i, groundY + Pixies.randomIndex(limit)],
						scale: 1,
						flipped: false,
						rotation: 0,
						path: Pixies.randomElement(nutrients)
					},
					strategy: STRATEGY_WATER,
					data: {amount: 0.3 + 0.7 * Math.random() }
				};
				this.level.sprites.add(new SpriteModel(state));
			}
		}
	}

	addTurner() {
		const turner = {
			image: {
				position: [0, 0],
				scale: 1,
				flipped: false,
				rotation: 0,
				path: IMAGE_BUG
			},
			strategy: STRATEGY_TURNER
		};
		this.level.sprites.add(new SpriteModel(turner));
	}

}
