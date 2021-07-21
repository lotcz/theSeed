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
		this.level = new LevelModel(state.level);
		this.addChild(this.level);

	}

}

