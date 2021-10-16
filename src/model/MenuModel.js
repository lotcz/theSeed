import ModelBase from "../class/ModelBase";
import MenuLineModel from "./MenuLineModel";

export default class MenuModel extends ModelBase {
	lines;
	closed;
	css;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.restoreChildren(state.lines, (line) => new MenuLineModel(line));
		this.closed = state.closed || false;
		this.css = state.css || null;
		this.makeDirty();
	}

	getState() {
		return {
			lines: this.getChildrenState(),
			closed: this.closed,
			css: this.css
		}
	}

}
