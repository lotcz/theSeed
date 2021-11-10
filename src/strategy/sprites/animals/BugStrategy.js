import MovementStrategy from "../MovementStrategy";
import Pixies from "../../../class/Pixies";

const BUG_TIMEOUT = 500;

export default class BugStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);
	}

	updateStrategy() {
		if (!this.level.isValidPosition(this.model.position)) {
			this.level.sprites.remove(this.model);
			console.log('Bug over board');
			return;
		}

		const lowerNeighbor = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(lowerNeighbor)) {
			this.setTargetPosition(lowerNeighbor);
			return;
		}

		const freeNeighbors = this.level.grid.getNeighbors(this.model.position).filter((n) => this.level.isPenetrable(n));
		const surfaceNeighbors = freeNeighbors.filter((n) => !this.level.isPenetrable(this.grid.getNeighborDown(n)));

		if (surfaceNeighbors.length > 0) {
			this.setTargetPosition(Pixies.randomElement(surfaceNeighbors));
		} else {
			this.setTargetPosition(Pixies.randomElement(freeNeighbors));
		}

	}

}
