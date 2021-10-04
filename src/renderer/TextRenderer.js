import SvgRenderer from "./SvgRenderer";
import Pixies from "../class/Pixies";
import WaterImage from "../../res/img/water.svg";
import {IMAGE_WATER} from "../builder/SpriteBuilder";
import ImageModel from "../model/ImageModel";
import ImageRenderer from "./ImageRenderer";
import Vector2 from "../class/Vector2";
import {BROWN_DARK, BROWN_LIGHT, GREEN_DARK, GREEN_LIGHT} from "./Palette";

const DEBUG_MENU = true;

export default class TextRenderer extends SvgRenderer {
	text;
	onClickListeners;
	onMouseOutListeners;
	onMouseOverListeners;

	constructor(game, model, draw, ) {
		super(game, model, draw);

		this.onClickListeners = [];
		this.onMouseOverListeners = [];
		this.onMouseOutListeners = [];
	}

	removeText() {
		if (this.text) this.text.remove();
	}

	addOnClickListener(listener) {
		this.onClickListeners.push(listener);
	}

	addOnMouseOverListener(listener) {
		this.onMouseOverListeners.push(listener);
	}

	addOnMouseOutListener(listener) {
		this.onMouseOutListeners.push(listener);
	}

	onClick(e) {
		this.onClickListeners.forEach((r) => r(e));
	}

	onMouseOver(e) {
		this.onMouseOverListeners.forEach((r) => r(e));
	}

	onMouseOut(e) {
		this.onMouseOutListeners.forEach((r) => r(e));
	}

	renderInternal() {
		this.removeText();

		const model = this.model;

		this.text = this.draw
			.text()
			.font(
				{
					family: model.fontFamily.get(),
					size: model.fontSize.get(),
					anchor: 'start',
					leading: '0'
				}
			)
			.fill(model.fill.get())
			.stroke(model.stroke.get())
			.move(model.position.x, model.position.y);

		const clickHandler = (e) => this.onClick(e);
		const mouseOverHandler = (e) => this.onMouseOver(e);
		const mouseOutHandler = (e) => this.onMouseOut(e);

		this.text.text(
			function(add) {
				add.tspan(model.label.get())
					.on('click', clickHandler)
					.on('mouseover', mouseOverHandler)
					.on('mouseout', mouseOutHandler);
			}
		);

	}

	deactivateInternal() {
		this.removeText();
	}

}
