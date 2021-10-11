import ModelBase from "./ModelBase";
import LevelModel from "./LevelModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";
import LevelEditorModel from "./LevelEditorModel";

const DEBUG_MODE = true;

export default class GameModel extends ModelBase {
	level;
	menu;
	editor;
	isInEditMode;
	viewBoxSize;

	constructor() {
		super();

		this.level = new DirtyValue();
		this.addChild(this.level);
		this.menu = new DirtyValue();
		this.addChild(this.menu);
		this.editor = new DirtyValue()
		this.addChild(this.editor);
		this.isInEditMode = new DirtyValue(DEBUG_MODE);
		this.addChild(this.isInEditMode);

		this.viewBoxSize = new Vector2();
		this.addChild(this.viewBoxSize);
	}

}

