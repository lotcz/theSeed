import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import RotationValue from "../class/RotationValue";

export const RESOURCE_TYPE_GROUP = 'group';
export const RESOURCE_TYPE_IMAGE = 'image';

export default class ResourceModel extends ModelBase {
	uri;
	data;
	resType;

	constructor(state) {
		super();

		if (state) {
			this.restoreState(state);
		}
	}

	getState() {
		return {
			uri: this.uri,
			data: this.data,
			resType: this.resType
		}
	}

	restoreState(state) {
		this.uri = state.uri;
		this.data = state.data;
		this.resType = state.resType;
	}

}
