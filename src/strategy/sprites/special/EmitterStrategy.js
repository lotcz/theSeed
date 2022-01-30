import Pixies from "../../../class/Pixies";
import StaticStrategy from "../StaticStrategy";
import {
	SPRITE_TYPE_GREEN_JELLY,
	SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_YELLOW_JELLY,
	STRATEGY_MINERAL
} from "../../../builder/sprites/SpriteStyleMinerals";
import {SPRITE_TYPE_RANDOM, SPRITE_TYPE_RANDOM_JELLY} from "../../../builder/sprites/SpriteStyleBasic";
import {
	SPRITE_TYPE_BEE_BROKEN_EGG, SPRITE_TYPE_BEE_DEAD,
	SPRITE_TYPE_BUG_DEAD,
	SPRITE_TYPE_BUG_EGG,
	SPRITE_TYPE_STONE
} from "../../../builder/sprites/SpriteStyleObjects";

const EMITTER_TIMEOUT = 1000;

export default class EmitterStrategy extends StaticStrategy {
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
			const visitors = this.chessboard.getVisitors(this.model.position, (v) => (v !== this.model) && ((v._is_sprite && v.type === this.model.data.type) || (v._is_penetrable === false)));
			if (visitors.length === 0) {
				this.emitted++;
				let style = this.model.data.type;
				if (style === SPRITE_TYPE_RANDOM) {
					style = Pixies.randomElement([SPRITE_TYPE_BUG_DEAD, SPRITE_TYPE_STONE, SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_BEE_BROKEN_EGG, SPRITE_TYPE_BEE_DEAD]);
				}
				if (style === SPRITE_TYPE_RANDOM_JELLY) {
					style = Pixies.randomElement([SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_GREEN_JELLY, SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_YELLOW_JELLY]);
				}
				const sprite = this.level.addSpriteFromStyle(this.model.position, style);
				if (this.model.data.amount) {
					sprite.data.amount = this.model.data.amount;
				}
			}
		}
	}

}
