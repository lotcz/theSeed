import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";
import Pixies from "../class/Pixies";
import WaterImage from "../../res/img/water.svg";
import {IMAGE_WATER} from "../builder/SpriteBuilder";
import ImageModel from "../model/ImageModel";
import ImageRenderer from "./ImageRenderer";

const DEBUG_INVENTORY = true;

export default class InventoryRenderer extends SvgRenderer {
	water;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.inventory = SVG().addTo(this.draw.root().parent());
		this.inventory.addClass('inventory');

		const width = this.game.viewBoxSize.x;
		const span = width / 5;
		const itemWidth = 100;
		const height = 100;
		this.inventory.size(width, height+5);

		const slot1start = span - (itemWidth/2);
		const slot1end = span + (itemWidth/2);

		const slot2start = width - span - (itemWidth/2);
		const slot2end = width - span + (itemWidth/2);

		this.inventory.rect(width, height/2).fill('black');
		this.inventory.path(`M 0 ${height/2}` +
			`L ${slot1start} ${height/2}` +
			`A ${itemWidth/2} ${height/2} 0 0 0 ${slot1end} ${height/2}` +
			`L ${slot2start} ${height/2}` +
			`A ${itemWidth/2} ${height/2} 0 0 0 ${slot2end} ${height/2}` +
			`L ${width} ${height/2}`)
			.fill('black')
			.stroke({width: 4, color: 'blue'});
		this.water = this.inventory.group();

		const image = this.water.image(WaterImage).size(itemWidth/2, itemWidth/2);
		this.water.center(span, height/2);
		this.waterText = this.water
			.text()
			.font(
				{
					family: 'Bastion',
					size: 25,
					anchor: 'start',
					leading: '1.5em'
				}
			)
			.fill('#1b6ed8ff')
			.move(slot1end, (height/2)-4);
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
