import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";

const DEBUG_INVENTORY = true;

export default class InventoryRenderer extends SvgRenderer {
	water;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.inventory = SVG().addTo(this.draw.root().parent());
		this.inventory.addClass('inventory');
		//console.log(this.inventory);

		if (DEBUG_INVENTORY) {
			this.inventory.circle(15);
		}
		this.water = null;
	}

	showWater() {
		this.hideWater();
		this.water = this.inventory.group();
		const waterN = this.model.water.get();

		console.log(waterN);
		this.water.text(
			function(add) {
				add.tspan(waterN)
			}
		).font({
			family:   'Helvetica',
			size:     25,
			anchor:   'start',
			leading:  '1.5em'
		}).fill('blue')
			.move(0, 100);

	}

	hideWater() {
		if (this.water) this.water.remove();
		this.water = null;
	}

	renderInternal() {
		if (this.model.water.isDirty()) {
			this.showWater();
			this.model.water.clean();
		}
	}

}
