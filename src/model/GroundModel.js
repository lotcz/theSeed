import Vector2 from "../class/Vector2";
import ModelBase from "../class/ModelBase";
import CollectionModel from "./CollectionModel";
import GroundTileModel from "./GroundTileModel";

export default class GroundModel extends ModelBase {
	tiles;

	constructor(state) {
		super();

		this.reset();
		this.tileRestoreFunc = (s) => new GroundTileModel(s);

		if (state) {
			this.restoreState(state);
		}
	}

	reset() {
		if (this.tiles !== null) {
			this.removeChild(this.tiles);
		}
		this.tiles = new CollectionModel();
		this.addChild(this.tiles);
	}

	restoreState(state) {
		this.reset();
		if (state.tiles) {
			this.tiles = new CollectionModel(state.tiles, this.tileRestoreFunc);
			this.addChild(this.tiles);
		}
	}

	addTile(state) {
		this.tiles.add(this.tileRestoreFunc(state));
	}

	removeTile(tile) {
		this.tiles.remove(tile);
	}

	getState() {
		return {
			tiles: this.tiles.getState()
		}
	}

}
