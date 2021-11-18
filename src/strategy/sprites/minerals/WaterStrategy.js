import {STRATEGY_WATER} from "../../../builder/SpriteStyle";
import MineralStrategy from "./MineralStrategy";
import SplashSound from "../../../../res/sound/splash.wav";
import Sound from "../../../class/Sound";

const WATER_TIMEOUT = 700;
export const WATER_UNIT_SIZE = 0.5;

export default class WaterStrategy extends MineralStrategy {
	static splashSound = new Sound(SplashSound);

	constructor(game, model, controls) {
		super(game, model, controls, WATER_TIMEOUT);
	}

	updateStrategy() {
		if (this.model.image.coordinates.distanceTo(this.level.bee.coordinates) < 2) {
			WaterStrategy.splashSound.replay();
			this.level.bee.hurt(0.5);
		}

		const visitors = this.chessboard.getTile(this.model.position).filter((v) => v !== this.model && v._is_sprite === true && v.strategy.get() === STRATEGY_WATER);
		if (visitors.length > 0) {
			visitors.forEach((v) => this.absorb(v));
		} else {
			super.updateStrategy();
		}
	}

}
