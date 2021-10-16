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

	getVisitors(position, filter) {
		const tile = this.getTile(position);
		if (filter) {
			return tile.filter(filter);
		} else {
			return tile;
		}
	}

	addVisitor(position, visitor) {
		let tile = this.getTile(position);
		if (tile.includes(visitor)) {
			console.log('Visitor already present');
		} else {
			tile.push(visitor);
		}
	}

	removeVisitor(position, visitor) {
		const tile = this.getTile(position);
		const index = tile.indexOf(visitor);
		if (index < 0) {
			console.log('Visitor not present');
		} else {
			tile.splice(index, 1);
		}
	}

}
