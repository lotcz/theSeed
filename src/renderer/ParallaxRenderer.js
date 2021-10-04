import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js";
import PlantRenderer from "./PlantRenderer";
import {BROWN_DARK, BROWN_LIGHT, GROUND_DARK, GROUND_LIGHT, SKY_DARK, SKY_LIGHT} from "./Palette";
import GroundRenderer from "./GroundRenderer";
import Vector2 from "../class/Vector2";
import RockImage from '../../res/img/rock.svg';
import HillImage from '../../res/img/hill.svg';
import EggHillsImage from '../../res/img/egghills.svg';
import StalkImage from '../../res/img/stalk.svg';
import WaterImage from '../../res/img/water.svg';
import TreesImage from '../../res/img/trees.svg';
import GrassImage from '../../res/img/grass.svg';

import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import ResourceLoader from "../class/ResourceLoader";

const PARALLAX_SIZE = 10;

export default class ParallaxRenderer extends SvgRenderer {

	constructor(game, model, draw) {
		super(game, model, draw);

		this.grid = game.level.grid;

		this.gridSize = this.grid.getMaxCoordinates();
		this.center = this.gridSize.multiply(0.5);
	}

	activateInternal() {
		this.background = this.draw.group();
		const max = this.gridSize;
		const linear = this.draw.gradient('linear', function (add) {
			add.stop(0, SKY_LIGHT);
			add.stop(1, SKY_DARK);
			add.from(0, 0);
			add.to(0, 1);
		})
		this.background.rect(max.x, max.y).fill(linear);
		this.background.back();

		// parallax
		this.parallax = this.draw.group();
		this.parallax.opacity(0.1);
		/*
		this.parallax.filterWith(function(add) {
			add.gaussianBlur(50)
		})
		*/

		/*
		// SEPIA
		this.parallax.filterWith(function(add) {
			add.colorMatrix('matrix', [ .343, .669, .119, 0, 0
				, .249, .626, .130, 0, 0
				, .172, .334, .111, 0, 0
				, .000, .000, .000, 1, 0 ])
		});
		*/

		// SEPIA

		this.parallax.filterWith(function (add) {
			add.colorMatrix('matrix',
				[0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, .000, .000, .000, 1, 0])
		});

		this.parallaxLayers = [];
		const height = max.y;
		const width = max.x;

		for (let i = PARALLAX_SIZE; i >= 0; i--) {
			const layer = this.model.layers[i];
			if (!layer) continue;

			const fullWidth = width * (1 + (0.3 * i / PARALLAX_SIZE));
			const group = this.parallax.group();
			const img = group.image(
				layer,
				function (e) {
					img.scale(fullWidth / img.width());
					img.move(width / 2, height / 2);
				}
			);

			this.parallaxLayers[i] = group;
		}
	}

	renderInternal() {
		for (let i = 0, max = PARALLAX_SIZE; i <= max; i++) {
			if (this.parallaxLayers[i]) {
				const layerOffset = this.model.cameraOffset.multiply((i / PARALLAX_SIZE));
				const layerCenter = this.center.add(layerOffset);
				this.parallaxLayers[i].center(layerCenter.x, layerCenter.y);
			}
		}
	}

}
