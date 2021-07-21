import Component from "./Component";
import ImageModel from "../model/ImageModel";
import BugStrategy from "../controller/BugStrategy";
import ImageRenderer from "../renderer/ImageRenderer";

export default class ComponentFactory {
	grid;
	draw;
	controls;

	constructor(grid, draw, controls) {
		this.grid = grid;
		this.draw = draw;
		this.controls = controls;
	}

	createComponent(state) {

	}

}
