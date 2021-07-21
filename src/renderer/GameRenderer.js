import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js"

import Stats from "../class/stats.module";
import * as dat from 'dat.gui';
import LevelRenderer from "./LevelRenderer";

const DEBUG_FPS = true;

export default class GameRenderer extends SvgRenderer {

	constructor(draw, model) {
		super(draw, model);

		this.levelRenderer = new LevelRenderer(draw, model.level);

		if (DEBUG_FPS) {
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
		}

	}

	render() {
		this.levelRenderer.render();

		if (DEBUG_FPS) {
			this.stats.update();
		}
	}

}
