import ModelBase from "./ModelBase";
import LivingTreeModel from "./LivingTreeModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";
import {DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_TEXT_STROKE_WIDTH} from "../renderer/Palette";

export default class TextModel extends ModelBase {
	position;
	label;
	fontFamily;
	fontSize;
	stroke;
	fill;

	constructor(state) {
		super();

		this.position = new Vector2();
		this.label = new DirtyValue("");
		this.addChild(this.label);
		this.fontFamily = new DirtyValue(DEFAULT_FONT_FAMILY);
		this.addChild(this.fontFamily);
		this.fontSize = new DirtyValue(DEFAULT_FONT_SIZE);
		this.addChild(this.fontSize);
		this.stroke = new DirtyValue({width: DEFAULT_TEXT_STROKE_WIDTH});
		this.addChild(this.stroke);
		this.fill = new DirtyValue('black');
		this.addChild(this.fill);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.label.set(state.label);
		if (state.position) this.position.setFromArray(state.position);
		if (state.fontFamily) this.fontFamily.set(state.fontFamily);
		if (state.fontSize) this.fontSize.set(state.fontSize);
		if (state.stroke) this.stroke.set(state.stroke);
		if (state.fill) this.fill.set(state.fill);
	}

	getState() {
		return {
			label: this.label.get(),
			position: this.position.toArray(),
			fontFamily: this.fontFamily.get(),
			fontSize: this.fontSize.get(),
			stroke: this.stroke.get(),
			fill: this.fill.get()
		}
	}

}
