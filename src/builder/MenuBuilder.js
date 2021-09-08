import MenuModel from "../model/MenuModel";
import TextModel from "../model/TextModel";
import MenuLineModel from "../model/MenuLineModel";
import Vector2 from "../class/Vector2";
import {
	BROWN_DARK, BROWN_LIGHT,
	DEFAULT_FONT_FAMILY,
	DEFAULT_FONT_SIZE,
	DEFAULT_LINE_HEIGHT, DEFAULT_TEXT_STROKE_WIDTH,
	GREEN_DARK,
	GREEN_LIGHT
} from "../renderer/Palette";

export default class MenuBuilder {
	menu;
	textStyle;
	selectedTextStyle;
	itemsStart;
	line;

	constructor() {
		this.menu = new MenuModel();
		this.textStyle = new TextModel();
		this.selectedTextStyle = new TextModel();
		this.itemsStart = new Vector2();
		this.line = 0;

		this.setPosition(new Vector2());
		this.setLineHeight(DEFAULT_LINE_HEIGHT);
		this.setFontSize(DEFAULT_FONT_SIZE);
		this.setFontFamily(DEFAULT_FONT_FAMILY);
		this.setFill('yellow');
		this.setSelectedFill('white');
		this.setStroke({color: 'orange', width: DEFAULT_TEXT_STROKE_WIDTH});
		this.setSelectedStroke({color: 'red', width: DEFAULT_TEXT_STROKE_WIDTH});
		this.setSize(new Vector2(0, 0));
	}

	setPosition(position) {
		this.menu.position.set(position);
	}

	setCss(cls) {
		this.menu.css = cls;
	}

	setStartPosition(position) {
		this.itemsStart.set(position);
	}

	setSize(size) {
		this.menu.size.set(size);
	}

	setLineHeight(h) {
		this.menu.lineHeight = h;
	}

	setFontSize(size) {
		this.textStyle.fontSize.set(size);
		this.selectedTextStyle.fontSize.set(size);
	}

	setFontFamily(family) {
		this.textStyle.fontFamily.set(family);
		this.selectedTextStyle.fontFamily.set(family);
	}

	setFill(fill) {
		this.textStyle.fill.set(fill);
		this.selectedTextStyle.fill.set(fill);
	}

	setStroke(stroke) {
		this.textStyle.stroke.set(stroke);
		this.selectedTextStyle.stroke.set(stroke);
	}

	setSelectedFill(fill) {
		this.selectedTextStyle.fill.set(fill);
	}

	setSelectedStroke(stroke) {
		this.selectedTextStyle.stroke.set(stroke);
	}

	addLine(label, onClick) {
		const position = this.itemsStart.addY(this.menu.lineHeight * (this.line + 1));
		const text = new TextModel(this.textStyle.getState());
		text.label.set(label);
		text.position.set(position);

		const selectedText = new TextModel(this.selectedTextStyle.getState());
		selectedText.label.set(label);
		selectedText.position.set(position);

		const menuLine = new MenuLineModel({
			text: text.getState(),
			selectedText: selectedText.getState(),
			selected: false,
			clicked: onClick
		});
		this.menu.addChild(menuLine);

		this.line++;

		this.menu.size.setX(Math.max(this.menu.size.x, label.length * this.textStyle.fontSize.get()));
		this.menu.size.setY(Math.max(this.menu.size.y, (this.menu.lineHeight * this.line) + 10));
	}

	build() {
		return this.menu;
	}

}
