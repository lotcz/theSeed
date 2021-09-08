import ModelBase from "./ModelBase";
import MenuLineModel from "./MenuLineModel";
import CollectionModel from "./CollectionModel";
import Vector2 from "../class/Vector2";
import {DEFAULT_LINE_HEIGHT} from "../renderer/Palette";

export default class MenuModel extends ModelBase {
	position;
	size;
	lines;
	lineHeight;
	closed;
	css;

	constructor(state) {
		super();

		this.closed = false;
		this.position = new Vector2();
		this.size = new Vector2(100, 100);
		this.lineHeight = DEFAULT_LINE_HEIGHT;

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.restoreChildren(state.lines, (line) => new MenuLineModel(line));
		this.closed = state.closed || false;
		this.lineHeight = state.lineHeight;
		this.size.setFromArray(state.size);
		this.position.setFromArray(state.position);
		this.css = state.css;
		this.makeDirty();
	}

	getState() {
		return {
			lines: this.getChildrenState(),
			closed: this.closed,
			lineHeight: this.lineHeight,
			size: this.size.toArray(),
			position: this.position.toArray(),
			css: this.css
		}
	}

}
