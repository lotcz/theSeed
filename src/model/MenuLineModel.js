import ModelBase from "./ModelBase";
import LivingTreeModel from "./LivingTreeModel";
import DirtyValue from "../class/DirtyValue";
import TextModel from "./TextModel";

export default class MenuLineModel extends ModelBase {
	text;
	selectedText;
	selected;
	clicked;

	constructor(state) {
		super();

		this.text = new TextModel();
		this.addChild(this.text);
		this.selectedText = new TextModel();
		this.addChild(this.selectedText);
		this.selected = new DirtyValue(false);
		this.addChild(this.selected);
		this.clicked = new DirtyValue(null);
		this.addChild(this.clicked);

		if (state) {
			this.restoreState(state);
		}
	}

	restoreState(state) {
		this.text.restoreState(state.text);
		this.selectedText.restoreState(state.selectedText);
		this.selected.set(state.selected);
		this.clicked.set(state.clicked);
		this.makeDirty();
	}

	getState() {
		return {
			text: this.text.getState(),
			selectedText: this.selectedText.getState(),
			selected: this.selected.get(),
			clicked: this.clicked.get()
		}
	}

}
