import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";
import Pixies from "../class/Pixies";
import WaterImage from "../../res/img/water.svg";
import {IMAGE_WATER} from "../builder/SpriteBuilder";
import ImageModel from "../model/ImageModel";
import ImageRenderer from "./ImageRenderer";
import Vector2 from "../class/Vector2";
import MenuLineRenderer from "./MenuLineRenderer";

const DEBUG_MENU = true;

export default class MenuRenderer extends SvgRenderer {
	menu;

	constructor(game, model, draw) {
		super(game, model, draw);
	}

	activateInternal() {
		this.menu = SVG().addTo(this.draw.root().parent());
		this.menu.addClass('menu');
		this.menu.addClass(this.model.css);
		this.menu.size(this.model.size.x, this.model.size.y);
		this.menu.attr({x: this.model.position.x, y: this.model.position.y});

		const lines = this.model.children;
		for (let i = 0, max = lines.length; i < max; i++) {
			const lineGroup = this.menu.group();
			const renderer = new MenuLineRenderer(this.game, lines[i], lineGroup);
			this.addChild(renderer);
			renderer.activate();
		}
	}

	deactivateInternal() {
		if (this.menu) this.menu.remove();
	}

}
