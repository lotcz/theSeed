import {
	SPRITE_STYLES, SPRITE_TYPE_BEE_BROKEN_EGG, SPRITE_TYPE_BEE_DEAD, SPRITE_TYPE_BEE_EGG,
	SPRITE_TYPE_BUG_DEAD, SPRITE_TYPE_BUG_EGG,
	SPRITE_TYPE_POLLEN,
	SPRITE_TYPE_RANDOM, SPRITE_TYPE_STONE,
	STRATEGY_MINERAL
} from "../../../builder/SpriteStyle";
import UpdatedStrategy from "../UpdatedStrategy";
import Pixies from "../../../class/Pixies";

const EMITTER_TIMEOUT = 1000;

export default class EmitterStrategy extends UpdatedStrategy {
	max;
	emitted;

	constructor(game, model, controls) {
		super(game, model, controls, EMITTER_TIMEOUT);

		this.max = -1;
		this.emitted = 0;
		this.randomizeTimeout = true;

		if (this.model.data.timeout) {
			this.defaultTimeout = this.model.data.timeout;
		}

		if (this.model.data.max !== undefined) {
			this.max = this.model.data.max;
		}
	}

	updateStrategy() {
		if (this.max === -1 || this.emitted < this.max) {
			const visitors = this.chessboard.getVisitors(this.model.position, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_MINERAL) && v.type === this.model.data.type);
			if (visitors.length === 0) {
				this.emitted++;
				let style = this.model.data.type;
				if (style === SPRITE_TYPE_RANDOM) {
					style = Pixies.randomElement([SPRITE_TYPE_BUG_DEAD, SPRITE_TYPE_STONE, SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_BEE_BROKEN_EGG, SPRITE_TYPE_BEE_DEAD]);
				}
				const sprite = this.level.addSpriteFromStyle(this.model.position, style);
				if (this.model.data.amount) {
					sprite.data.amount = this.model.data.amount;
				}
			}
		}
	}

}
