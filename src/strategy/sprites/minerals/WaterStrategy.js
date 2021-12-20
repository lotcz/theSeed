import MineralStrategy from "./MineralStrategy";
import SplashSound from "../../../../res/sound/splash.mp3";
import Sound from "../../../class/Sound";
import {STRATEGY_WATER} from "../../../builder/sprites/SpriteStyleMinerals";

const WATER_TIMEOUT = 700;

export default class WaterStrategy extends MineralStrategy {
	static splashSound = new Sound(SplashSound);

	constructor(game, model, controls) {
		super(game, model, controls, WATER_TIMEOUT);

		this.model._is_crawlable = false;
		this.model._is_penetrable = false;
	}

	updateStrategy() {
		if (this.level.isWater(this.model.position)) {
			this.removeMyself();
			return;
		}

		if (this.level.isGround(this.model.position)) {
			const down = this.grid.getNeighborDown(this.model.position);
			if (this.level.isGround(down)) {
				this.setTargetPosition(down);
				return;
			}
		}

		super.updateStrategy();
	}

	updateStillObject() {
		const visitors = this.chessboard.getTile(this.model.position).filter((v) => v !== this.model && v._is_sprite === true && v.strategy.get() === STRATEGY_WATER);
		if (visitors.length > 0) {
			visitors.forEach((v) => this.absorb(v));
		}
	}
}
