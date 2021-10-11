import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js";

import {SKY_DARK, SKY_LIGHT} from "./Palette";

export default class ParallaxRenderer extends SvgRenderer {

	constructor(game, model, background, foreground) {
		super(game, model, background);

		this.background = background;
		this.foreground = foreground;
	}

	activateInternal() {
		this.gridSize = this.grid.getMaxCoordinates();
		this.center = this.gridSize.multiply(0.5);

		const linear = this.background.gradient('linear', function (add) {
			add.stop(0, SKY_LIGHT);
			add.stop(1, SKY_DARK);
			add.from(0, 0);
			add.to(0, 1);
		});
		this.background.rect(this.gridSize.x, this.gridSize.y).fill(linear);

		const parallaxBack = this.background.group().addClass('parallax-back');
		parallaxBack.opacity(0.1);
		parallaxBack.filterWith(function (add) {
			add.colorMatrix('matrix',
				[0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, .000, .000, .000, 1, 0])
		});

		// TO DO: sort parallax layers by distance

		this.model.layers.forEach((layer) => {
			console.log(layer);
			layer.image.size = this.gridSize;
			const layerRenderer = new ImageRenderer(this.game, layer.image, layer.distance < 0 ? this.foreground : parallaxBack);
			this.addChild(layerRenderer);
			layerRenderer.activate();
		});

	}

	renderInternal() {
		this.model.layers.forEach((layer) => {
			const layerOffset = this.model.cameraOffset.multiply(layer.distance);
			const layerCenter = this.center.add(layerOffset);
			layer.image.coordinates.set(layerCenter.x, layerCenter.y);
		});

		//this.children.forEach((ch) => ch.render());

	}

}
