import ModelBase from "./ModelBase";
import LevelModel from "./LevelModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";

export default class GameModel extends ModelBase {
	level;
	menu;
	loading;
	levelChanged;
	menuChanged;
	viewBoxSize;

	constructor(state) {
		super();

		this.loading = new DirtyValue(true);
		this.addChild(this.loading);
		this.levelChanged = new DirtyValue(false);
		this.addChild(this.levelChanged);
		this.viewBoxSize = new Vector2();
		this.addChild(this.viewBoxSize);
		this.menuChanged = new DirtyValue(false);
		this.addChild(this.menuChanged);

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			level: this.level.getState()
		}
	}

	restoreState(state) {
		this.level = new LevelModel(state.level);
		this.addChild(this.level);
	}

	setLevel(level) {
		if (this.level) this.removeChild(this.level);
		this.level = level;
		this.addChild(level);
		this.levelChanged.set(true);
	}

	setMenu(menu) {
		if (this.menu) this.removeChild(this.menu);
		this.menu = menu;
		if (menu !== null) this.addChild(menu);
		this.menuChanged.set(true);
	}

}

