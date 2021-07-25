import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js"

import Stats from "../class/stats.module";
import * as dat from 'dat.gui';
import LevelRenderer from "./LevelRenderer";

const DEBUG_FPS = true;

export default class GameRenderer extends SvgRenderer {

	constructor(model, draw) {
		super(model, model, draw);

		this.levelRenderer = new LevelRenderer(model, model.level, draw);
		this.addChild(this.levelRenderer);

		if (DEBUG_FPS) {
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
		}

	}

	renderInternal() {
		if (DEBUG_FPS) {
			this.stats.update();
		}
	}

}
