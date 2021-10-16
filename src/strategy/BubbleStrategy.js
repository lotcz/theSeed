import SpriteControllerStrategy from "./SpriteControllerStrategy";
import {WATER_UNIT_SIZE} from "./WaterStrategy";

const BUBBLE_TIMEOUT = 2000;

export default class BubbleStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, BUBBLE_TIMEOUT);

		this.turningEnabled = false;

		if (!this.model.data.amount) {
			this.model.data.amount = 1;
		}
		this.timeout = 0;
	}

	selectTargetInternal() {
		if (!this.level.isValidPosition(this.position)) {
			console.log('Bubble over board');
			this.level.sprites.remove(this.model);
			return;
		}

		if (this.level.isWater(this.position)) {
			const up = this.grid.getNeighborUp(this.position);
			this.setTarget(up);
			this.model.data.amount -= WATER_UNIT_SIZE;
		} else {
			this.level.sprites.remove(this.model);
		}

	}

	updateInternal(delta) {
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI))
		if (scale > 0) {
			this.targetScale = scale * 2;
		}
	}

}
