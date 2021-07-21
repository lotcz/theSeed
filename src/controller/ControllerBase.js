import Tree from "../class/Tree";

export default class ControllerBase extends Tree {
	grid;
	model;
	controls;

	constructor(grid, model, controls) {
		super();
		this.grid = grid;
		this.model = model;
		this.controls = controls;

	}


	update(delta) {

	}



}
