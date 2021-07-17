import ModelBase from "./ModelBase";
import LivingTreeModel from "./LivingTreeModel";

export default class PlantModel extends ModelBase {
	roots;
	stem;

	constructor(state) {
		super(state);
	}

	isDirty() {
		return this.roots.isDirty() || this.stem.isDirty();
	}

	restoreState(state) {
		this.roots = new LivingTreeModel(state.roots);
		this.stem = new LivingTreeModel(state.stem);
		this.makeDirty();
		//this.roots.restoreState(state);
		//this.stem.restoreState(state);
	}

	getState() {
		return {
			roots: this.roots.getState(),
			stem: this.stem.getState()
		}
	}

}
