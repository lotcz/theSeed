import SvgRenderer from "./SvgRenderer";
import Pixies from "../class/Pixies";
import WaterImage from "../../res/img/water.svg";
import {IMAGE_WATER} from "../builder/SpriteBuilder";
import ImageModel from "../model/ImageModel";
import ImageRenderer from "./ImageRenderer";
import Vector2 from "../class/Vector2";
import {BROWN_DARK, BROWN_LIGHT, GREEN_DARK, GREEN_LIGHT} from "./Palette";
import TextRenderer from "./TextRenderer";

const DEBUG_MENU = true;

export default class MenuLineRenderer extends SvgRenderer {
	textRenderer;
	selectedTextRenderer;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.textRenderer = new TextRenderer(game, model.text, draw);
		this.addListenersToRenderer(this.textRenderer);
		this.addChild(this.textRenderer);

		this.selectedTextRenderer = new TextRenderer(game, model.selectedText, draw);
		this.addListenersToRenderer(this.selectedTextRenderer);
		this.addChild(this.selectedTextRenderer);
	}

	addListenersToRenderer(renderer) {
		renderer.addOnClickListener((e) => this.textClick(e));
		renderer.addOnMouseOverListener((e) => this.textMouseOver(e));
		renderer.addOnMouseOutListener((e) => this.textMouseOut(e));
	}

	renderInternal() {
		if (this.model.selected.get() && !this.selectedTextRenderer.isActivated()) {
			this.selectedTextRenderer.activate();
			this.textRenderer.deactivate();
		}
		if (this.selectedTextRenderer.isActivated() && !this.model.selected.get()) {
			this.selectedTextRenderer.deactivate();
			this.textRenderer.activate();
		}
	}

	textClick(e) {
		const clickHandler = this.model.clicked.get();
		clickHandler(e);
	}

	textMouseOver(e) {
		this.model.selected.set(true);
	}

	textMouseOut(e) {
		this.model.selected.set(false);
	}

}
