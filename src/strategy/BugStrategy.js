import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";

const BUG_TIMEOUT = 500;

export default class BugStrategy extends SpriteControllerStrategy {
	lastDirection;

	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);

		this.lastDirection = null;
	}

	selectTargetInternal() {

		const lowerNeighbor = this.grid.getNeighborDown(this.position);
		if ((!this.level.isGround(this.position)) && (!this.level.isGround(lowerNeighbor))) {
			if (!this.level.isValidPosition(lowerNeighbor)) {
				this.level.sprites.remove(this.model);
				return;
			}
			this.setTarget(lowerNeighbor);
			return;
		}
		const upperNeighbor = this.grid.getNeighborUp(this.position);
		if (this.level.isGround(this.position) && this.level.isGround(upperNeighbor)) {
			this.setTarget(upperNeighbor);
			return;
		}

		const validNeighbors = this.level.grid.getValidNeighbors(this.position);
		const groundNeighbors = validNeighbors.filter((n) => this.level.isGround(n));
		this.setTarget(Pixies.randomElement(groundNeighbors));

	}

}
