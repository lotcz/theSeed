import ModelBase from "./ModelBase";
import LevelModel from "./LevelModel";

export default class GameModel extends ModelBase {
	level;

	constructor(state) {
		super();

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
		this.setLevel(new LevelModel(state.level))
	}

	setLevel(level) {
		this.level = level;
		this.addChild(level);
	}
}

