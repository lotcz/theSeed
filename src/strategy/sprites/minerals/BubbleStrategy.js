import MovementStrategy from "../MovementStrategy";
import {WATER_UNIT_SIZE} from "./WaterStrategy";
import {SPRITE_TYPE_WATER} from "../../../builder/SpriteStyle";
import MineralStrategy from "./MineralStrategy";

const BUBBLE_TIMEOUT = 2000;

export default class BubbleStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, BUBBLE_TIMEOUT);

		if (!this.model.data.amount) {
			this.model.data.amount = 1;
		}
		this.timeout = 0;
	}

	updateStrategy() {
		if (!this.level.isValidPosition(this.model.position)) {
			console.log('Bubble over board');
			this.level.sprites.remove(this.model);
			return;
		}

		if (this.level.isWater(this.model.position)) {
			const up = this.grid.getNeighborUp(this.model.position);
			this.setTargetPosition(up);
			this.model.data.amount -= 0.1;
			if (this.model.data.amount <= 0) {
				this.level.sprites.remove(this.model);
			}
		} else {
			this.level.sprites.remove(this.model);
			this.level.addSpriteFromStyle(this.model.position, SPRITE_TYPE_WATER);
		}
	}

	updateInternal(delta) {
		this.setTargetScale(MineralStrategy.getScale(this.model.data.amount));
		super.updateInternal(delta);
	}

}
