import MovementStrategy from "../MovementStrategy";
import Pixies from "../../../class/Pixies";
import BiteSound from "../../../../res/sound/bite.wav";
import {MINERAL_FALL_TIMEOUT} from "../minerals/MineralStrategy";
import Sound from "../../../class/Sound";
import {SPRITE_TYPE_POTASSIUM} from "../../../builder/SpriteStyle";

const BUG_TIMEOUT = 1000;

export default class BugStrategy extends MovementStrategy {
	static biteSound = new Sound(BiteSound);

	constructor(game, model, controls) {
		super(game, model, controls, BUG_TIMEOUT);
	}

	activateInternal() {
		this.model._is_penetrable = false;
		super.activateInternal();
	}

	updateStrategy() {
		if (!this.level.isValidPosition(this.model.position)) {
			this.level.sprites.remove(this.model);
			console.log('Bug over board');
			return;
		}

		const lowerNeighbor = this.grid.getNeighborDown(this.model.position);
		if (this.level.isPenetrable(lowerNeighbor)) {
			this.defaultTimeout = MINERAL_FALL_TIMEOUT;
			this.setTargetPosition(lowerNeighbor);
			return;
		}

		this.defaultTimeout = BUG_TIMEOUT;

		const food = this.chessboard.getVisitors(this.model.position, (v) => v._is_sprite === true && v.type === SPRITE_TYPE_POTASSIUM);
		if (food.length > 0) {
			return;
		}

		const neighbors = this.level.grid.getNeighbors(this.model.position);
		neighbors.push(this.model.position);

		if (this.level.isPlayable && this.level.bee) {
			const beePresent = neighbors.filter((n) => n.equalsTo(this.level.bee.position)).length > 0;
			if (beePresent) {
				BugStrategy.biteSound.replay();
				this.level.bee.hurt(0.5);
			}
		}

		const freeNeighbors = neighbors.filter((n) => this.level.isPenetrable(n));
		const surfaceNeighbors = freeNeighbors.filter((n) => this.level.isGround(this.grid.getNeighborDown(n)));

		if (surfaceNeighbors.length > 0) {
			this.setTargetPosition(Pixies.randomElement(surfaceNeighbors));
		} else {
			this.setTargetPosition(Pixies.randomElement(freeNeighbors));
		}

	}

}
