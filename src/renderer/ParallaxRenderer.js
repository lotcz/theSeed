import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js";

import {SKY_DARK, SKY_LIGHT} from "./Palette";

const PARALLAX_SIZE = 10;

export default class ParallaxRenderer extends SvgRenderer {

	constructor(game, model, draw) {
		super(game, model, draw);
	}

	activateInternal() {
		console.log(this.model);

		this.grid = this.game.level.grid;
		this.gridSize = this.grid.getMaxCoordinates();
		this.center = this.gridSize.multiply(0.5);
		const background = this.draw.group();

		const linear = this.draw.gradient('linear', function (add) {
			add.stop(0, SKY_LIGHT);
			add.stop(1, SKY_DARK);
			add.from(0, 0);
			add.to(0, 1);
		})
		background.rect(this.gridSize.x, this.gridSize.y).fill(linear);
		background.back();

		// parallax
		this.parallax = this.draw.group().addClass('parallax');
		this.parallax.opacity(0.1);

		this.parallax.filterWith(function (add) {
			add.colorMatrix('matrix',
				[0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, .000, .000, .000, 1, 0])
		});

		// TO DO: sort parallax layers by distance

		this.model.layers.forEach((layer) => {
			const layerRenderer = new ImageRenderer(this.game, layer.image, this.parallax);
			this.addChild(layerRenderer);
			layerRenderer.activate();
		});

	}

	renderInternal() {
		console.log('rendering parallax');

		// TO DO: create parallax controller?

		this.model.layers.forEach((layer) => {
			const layerOffset = this.model.cameraOffset.multiply(layer.distance);
			const layerCenter = this.center.add(layerOffset);
			layer.image.coordinates.set(layerCenter.x, layerCenter.y);
		});

		//this.children.forEach((ch) => ch.render());

	}

}
