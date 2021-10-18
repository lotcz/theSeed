import WaterImage from "../../res/img/water.svg";
import BubbleImage from "../../res/img/bubble.svg";
import NitrogenImage from "../../res/img/nitrogen.svg";
import CalciumImage from "../../res/img/calcium.svg";
import PhosphorusImage from "../../res/img/phosphorus.svg";
import PotassiumImage from "../../res/img/potassium.svg";
import SulfurImage from "../../res/img/sulfur.svg";
import MagnesiumImage from "../../res/img/magnesium.svg";

import ButterflyImage from "../../res/img/butterfly.svg";
import LadybugImage from "../../res/img/my-lady-bug.svg";
import GrasshopperImage from "../../res/img/grasshopper.svg";
import WormHeadImage from "../../res/img/worm-head.svg";
import WormBodyImage from "../../res/img/worm-body.svg";
import WormButtImage from "../../res/img/worm-butt.svg";

export const IMAGE_BEE = 'img/bee.svg';
export const IMAGE_BEE_WING = 'img/wing.svg';
export const IMAGE_WATER = 'img/water.svg';
export const IMAGE_BUBBLE = 'img/bubble.svg';
export const IMAGE_NITROGEN = 'img/nitrogen.svg';
export const IMAGE_POTASSIUM = 'img/potassium.svg';
export const IMAGE_SULFUR = 'img/sulfur.svg';
export const IMAGE_CALCIUM = 'img/calcium.svg';
export const IMAGE_MAGNESIUM = 'img/magnesium.svg';
export const IMAGE_PHOSPHORUS = 'img/phosphorus.svg';

export const IMAGE_BUG = 'img/ladybug.svg';
export const IMAGE_BUTTERFLY = 'img/butterfly.svg';
export const IMAGE_GRASSHOPPER = 'img/grasshopper.svg';
export const IMAGE_WORM_HEAD = 'img/worm-head.svg';
export const IMAGE_WORM_BODY = 'img/worm-body.svg';
export const IMAGE_WORM_BUTT = 'img/worm-butt.svg';

export const SPRITE_TYPE_BUG = 'bug';
export const SPRITE_TYPE_BUTTERFLY = 'butterfly';
export const SPRITE_TYPE_WATER = 'water';
export const SPRITE_TYPE_BUBBLE = 'bubble';
export const SPRITE_TYPE_POTASSIUM = 'potassium';
export const SPRITE_TYPE_RESPAWN = 'respawn';
export const SPRITE_TYPE_EXIT = 'exit';
export const SPRITE_TYPE_EMITTER = 'emitter';

export const STRATEGY_BUG = 'bug';
export const STRATEGY_BUTTERFLY = 'butterfly';
export const STRATEGY_WORM = 'worm';
export const STRATEGY_BUBBLE = 'bubble';
export const STRATEGY_WATER = 'water';
export const STRATEGY_MINERAL = 'mineral';

export const STRATEGY_EMITTER = 'emitter';
export const STRATEGY_RESPAWN = 'respawn';
export const STRATEGY_EXIT = 'exit';
export const STRATEGY_TURNER = 'turner';

export const SPRITE_STRATEGIES = [STRATEGY_BUG, STRATEGY_WATER, STRATEGY_BUBBLE, STRATEGY_MINERAL, STRATEGY_BUTTERFLY, STRATEGY_WORM, STRATEGY_RESPAWN, STRATEGY_EXIT, STRATEGY_EMITTER];

export const SPRITE_STYLES = [];

SPRITE_STYLES[SPRITE_TYPE_BUG] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_BUG,
		resource: LadybugImage
	}
};

SPRITE_STYLES[SPRITE_TYPE_BUTTERFLY] = {
	strategy: STRATEGY_BUTTERFLY,
	image: {
		uri: IMAGE_BUTTERFLY,
		resource: ButterflyImage
	}
};

SPRITE_STYLES[SPRITE_TYPE_WATER] = {
	strategy: STRATEGY_WATER,
	image: {
		uri: IMAGE_WATER,
		resource: WaterImage,
		scale: 0
	}
};

SPRITE_STYLES[SPRITE_TYPE_BUBBLE] = {
	strategy: STRATEGY_BUBBLE,
	image: {
		uri: IMAGE_BUBBLE,
		resource: BubbleImage,
		scale: 0
	}
};


SPRITE_STYLES[SPRITE_TYPE_POTASSIUM] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_POTASSIUM,
		resource: PotassiumImage
	}
};

SPRITE_STYLES[SPRITE_TYPE_RESPAWN] = {
	strategy: STRATEGY_RESPAWN
};

SPRITE_STYLES[SPRITE_TYPE_EXIT] = {
	strategy: STRATEGY_EXIT
};

SPRITE_STYLES[SPRITE_TYPE_EMITTER] = {
	strategy: STRATEGY_EMITTER,
	data: {type:'water',timeout:1000,max:5}
};
