import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";
import Vector2 from "../class/Vector2";
import WaterImage from "../../res/img/water.svg";

const DEBUG_INVENTORY = true;

export default class InventoryRenderer extends SvgRenderer {
	water;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.inventory = SVG().addTo(this.draw.root().parent());
		this.inventory.addClass('inventory');

		const width = 100;
		const height = 50;
		this.inventory.size(width, height);
		const position = new Vector2(this.game.viewBoxSize.x/2, height/2);
		this.inventory.center(position.x, position.y);
		this.water = this.inventory.group();

		const image = this.water.image(WaterImage).size(width/2, height).center((width*0.75), height/2);

		this.waterText = this.water
			.text()
			.font(
				{
					family: 'Bastion',
					size: 25,
					anchor: 'start',
					leading: '0'
				}
			)
			.fill('#1b6ed8ff')
			.move(0, (height/2)+10);
	}

	showWater() {
		const waterN = Math.round(this.model.water.get()*10)/10;
		if (!this.waterText) {

		}
		this.waterText.text(
			function(add) {
				add.tspan(waterN)
			}
		);
	}

	renderInternal() {
		if (this.model.water.isDirty()) {
			this.showWater();
			this.model.water.clean();
		}
	}

	deactivateInternal() {
		if (this.inventory) this.inventory.remove();
	}
}
