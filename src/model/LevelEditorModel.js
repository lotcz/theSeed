import ModelBase from "./ModelBase";
import {GROUND_TYPE_BASIC, GROUND_TYPE_EMPTY} from "./GroundTileModel";

export default class LevelEditorModel extends ModelBase {
	groundTypes;
	selectedGroundType;

	constructor() {
		super();

		this.groundTypes = [
			GROUND_TYPE_EMPTY,
			GROUND_TYPE_BASIC
		];
		this.selectedGroundType = GROUND_TYPE_BASIC;

	}

}
