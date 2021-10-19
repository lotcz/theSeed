import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js";

export default class ParallaxRenderer extends SvgRenderer {

	constructor(game, model, background, foreground) {
		super(game, model, background);

		this.background = background;
		this.foreground = foreground;
	}

	activateInternal() {
		this.gridSize = this.grid.getMaxCoordinates();
		this.center = this.gridSize.multiply(0.5);

		let fill = null;
		if (this.model.backgroundColor !== this.model.backgroundColorEnd) {
			fill = this.background.gradient('linear', (add) => {
				add.stop(0, this.model.backgroundColor);
				add.stop(1, this.model.backgroundColorEnd);
				add.from(0, 0);
				add.to(0, 1);
			});
		} else {
			fill = this.model.backgroundColor;
		}
		this.background.rect(this.gridSize.x, this.gridSize.y).fill(fill);

		const parallaxBack = this.background.group().addClass('parallax-back');
		parallaxBack.opacity(0.1);
		parallaxBack.filterWith(function (add) {
			add.colorMatrix('matrix',
				[0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, 0, 0, 1, 0, 0
					, .000, .000, .000, 1, 0])
		});

		// TODO: sort parallax layers by distance

		this.model.layers.forEach((layer) => {
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
	}

}
