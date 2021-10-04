export default class Chessboard {
	tiles;

	constructor() {
		this.tiles = [];
	}

	getTile(position) {
		if (!this.tiles[position.x]) {
			this.tiles[position.x] = [];
		}
		if (!this.tiles[position.x][position.y]) {
			this.tiles[position.x][position.y] = [];
		}
		return this.tiles[position.x][position.y];
	}

	addVisitor(position, visitor) {
		let tile = this.getTile(position);
		tile.push(visitor);
	}

	removeVisitor(position, visitor) {
		const tile = this.getTile(position);
		tile.splice(tile.indexOf(visitor), 1);
	}

}