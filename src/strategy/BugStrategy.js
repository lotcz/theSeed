import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import {STRATEGY_WATER} from "../builder/SpriteStyle";

const BUG_TIMEOUT = 500;

export default class BugStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);

	}

	selectTargetInternal() {

		if (!this.level.isValidPosition(this.position)) {
			this.level.sprites.remove(this.model);
			console.log('Bug over board');
			return;
		}

		const lowerNeighbor = this.grid.getNeighborDown(this.position);
		if (this.level.isPenetrable(lowerNeighbor)) {
			this.setTarget(lowerNeighbor);
			return;
		}

		const freeNeighbors = this.level.grid.getNeighbors(this.position).filter((n) => this.level.isPenetrable(n));
		const surfaceNeighbors = freeNeighbors.filter((n) => !this.level.isPenetrable(this.grid.getNeighborDown(n)));

		if (surfaceNeighbors.length > 0) {
			this.setTarget(Pixies.randomElement(surfaceNeighbors));
		} else {
			this.setTarget(Pixies.randomElement(freeNeighbors));
		}

	}

}
