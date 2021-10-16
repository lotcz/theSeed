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
		if ((!this.level.isGround(this.position)) && (this.level.isPenetrable(lowerNeighbor))) {
			this.setTarget(lowerNeighbor);
			return;
		}

		const groundNeighbors = this.level.grid.getNeighbors(this.position).filter((g) => g.strategy !== STRATEGY_WATER && !this.level.isPenetrable(g));
		const surfaceNeighbors = groundNeighbors.filter((g) => {
			const airNeighbors = this.level.grid.getNeighbors(g).filter((a) => this.level.isPenetrable(a));
			return airNeighbors.length > 0;
		});

		if (surfaceNeighbors.length > 0) {
			this.setTarget(Pixies.randomElement(surfaceNeighbors));
		} else {
			this.setTarget(Pixies.randomElement(groundNeighbors));
		}


	}

}
