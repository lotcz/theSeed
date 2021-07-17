import ModelBase from "./ModelBase";
import RootsModel from "./RootsModel";
import StemModel from "./StemModel";

export default class PlantModel extends ModelBase {
	position;
	roots;
	stem;

	constructor(position) {
		super();

		this.roots = new RootsModel(position);
		this.stem = new StemModel(position);
	}

	isDirty() {
		return this.roots.isDirty() || this.stem.isDirty();
	}

	restoreState(state) {
		this.roots.restoreState(state);
		this.stem.restoreState(state);
	}
}
