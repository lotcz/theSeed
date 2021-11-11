import WaterImage from "../../res/img/water.svg";
import BubbleImage from "../../res/img/bubble.svg";
import JellymakerImage from "../../res/img/jellymaker.svg";
import HintBackgroundImage from "../../res/img/hint-background.svg";
import PotassiumImage from "../../res/img/potassium.svg";
import ButterflyImage from "../../res/img/butterfly.svg";
import LadybugImage from "../../res/img/ladybug.svg";
import ExitImage from "../../res/img/exit.svg";
import NitrogenImage from "../../res/img/nitrogen.svg";
import PhosphorusImage from "../../res/img/phosphorus.svg";

import {NEIGHBOR_TYPE_UP} from "../model/GridModel";
import {GROUND_TYPE_GRASS} from "./GroundStyle";

/*

import SulfurImage from "../../res/img/sulfur.svg";
import MagnesiumImage from "../../res/img/magnesium.svg";
import GrasshopperImage from "../../res/img/grasshopper.svg";
import WormHeadImage from "../../res/img/worm-head.svg";
import WormBodyImage from "../../res/img/worm-body.svg";
import WormButtImage from "../../res/img/worm-butt.svg";
*/
export const IMAGE_BEE = 'img/bee.svg';
export const IMAGE_BEE_DEAD = 'img/bee-dead.svg';
export const IMAGE_BEE_CRAWL = 'img/bee-walk.svg';
export const IMAGE_BEE_WING = 'img/wing.svg';

export const IMAGE_STARS_1 = 'img/stars-1.svg';
export const IMAGE_STARS_2 = 'img/stars-2.svg';
export const IMAGE_STARS_3 = 'img/stars-3.svg';

export const IMAGE_HINT_BACKGROUND = 'img/hint-background.svg';
export const IMAGE_EXIT = 'img/exit.svg';

export const IMAGE_WATER = 'img/water.svg';
export const IMAGE_BUBBLE = 'img/bubble.svg';
export const IMAGE_NITROGEN = 'img/nitrogen.svg';
export const IMAGE_POTASSIUM = 'img/potassium.svg';
export const IMAGE_SULFUR = 'img/sulfur.svg';
export const IMAGE_CALCIUM = 'img/calcium.svg';
export const IMAGE_MAGNESIUM = 'img/magnesium.svg';
export const IMAGE_PHOSPHORUS = 'img/phosphorus.svg';

export const IMAGE_JELLYMAKER = 'img/jellymaker.svg';
export const IMAGE_BUG = 'img/ladybug.svg';
export const IMAGE_BUTTERFLY = 'img/butterfly.svg';
export const IMAGE_GRASSHOPPER = 'img/grasshopper.svg';
export const IMAGE_WORM_HEAD = 'img/worm-head.svg';
export const IMAGE_WORM_BODY = 'img/worm-body.svg';
export const IMAGE_WORM_BUTT = 'img/worm-butt.svg';

export const SPRITE_TYPE_JELLYMAKER = 'jellymaker';
export const SPRITE_TYPE_HINT = 'hint';
export const SPRITE_TYPE_BUG = 'bug';
export const SPRITE_TYPE_BUTTERFLY = 'butterfly';
export const SPRITE_TYPE_WATER = 'water';
export const SPRITE_TYPE_BUBBLE = 'bubble';
export const SPRITE_TYPE_POTASSIUM = 'potassium';
export const SPRITE_TYPE_POLLEN = 'pollen';
export const SPRITE_TYPE_NECTAR = 'nectar';
export const SPRITE_TYPE_RESPAWN = 'respawn';
export const SPRITE_TYPE_EXIT = 'exit';
export const SPRITE_TYPE_EMITTER = 'emitter';
export const SPRITE_TYPE_DOOR_SLOT = 'door-slot';

export const STRATEGY_STATIC = 'static';

export const STRATEGY_JELLYMAKER = 'jellymaker';
export const STRATEGY_HINT = 'hint';
export const STRATEGY_BUG = 'bug';
export const STRATEGY_BUTTERFLY = 'butterfly';
export const STRATEGY_WORM = 'worm';
export const STRATEGY_BUBBLE = 'bubble';
export const STRATEGY_WATER = 'water';
export const STRATEGY_MINERAL = 'mineral';

export const STRATEGY_EMITTER = 'emitter';

export const STRATEGY_EXIT = 'exit';
export const STRATEGY_TURNER = 'turner';
export const STRATEGY_DOOR_SLOT = 'door-slot';

export const SPRITE_STRATEGIES = [STRATEGY_STATIC, STRATEGY_BUG, STRATEGY_WATER, STRATEGY_BUBBLE, STRATEGY_MINERAL, STRATEGY_BUTTERFLY, STRATEGY_WORM, STRATEGY_EXIT, STRATEGY_EMITTER, STRATEGY_JELLYMAKER, STRATEGY_HINT, STRATEGY_DOOR_SLOT];

export const SPRITE_STYLES = [];

SPRITE_STYLES[SPRITE_TYPE_JELLYMAKER] = {
	strategy: STRATEGY_JELLYMAKER,
	image: {
		uri: IMAGE_JELLYMAKER,
		resource: JellymakerImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP
	},
	oriented: true
};

SPRITE_STYLES[SPRITE_TYPE_HINT] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_BACKGROUND,
		resource: HintBackgroundImage,
		scale: 0.1
	},
};

SPRITE_STYLES[SPRITE_TYPE_BUG] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_BUG,
		resource: LadybugImage
	},
	oriented: true
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
		scale: 0.01
	},
	data: {amount: 1}
};

SPRITE_STYLES[SPRITE_TYPE_BUBBLE] = {
	strategy: STRATEGY_BUBBLE,
	image: {
		uri: IMAGE_BUBBLE,
		resource: BubbleImage,
		scale: 0.01
	},
	data: {amount: 1}
};

SPRITE_STYLES[SPRITE_TYPE_POTASSIUM] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_POTASSIUM,
		resource: PotassiumImage,
		scale: 0.01
	},
	data: {amount: 1}
};

SPRITE_STYLES[SPRITE_TYPE_POLLEN] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_PHOSPHORUS,
		resource: PhosphorusImage,
		scale: 0.01
	},
	data: {amount: 1}
};

SPRITE_STYLES[SPRITE_TYPE_NECTAR] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_NITROGEN,
		resource: NitrogenImage,
		scale: 0.01
	},
	data: {amount: 1}
};

SPRITE_STYLES[SPRITE_TYPE_RESPAWN] = {
	strategy: STRATEGY_STATIC,
	data: {name: 'start'}
};

SPRITE_STYLES[SPRITE_TYPE_EXIT] = {
	strategy: STRATEGY_EXIT,
	image: {
		uri: IMAGE_EXIT,
		resource: ExitImage
	},
	data: {level: 'level-0'}
};

SPRITE_STYLES[SPRITE_TYPE_EMITTER] = {
	strategy: STRATEGY_EMITTER,
	data: {type:'water', timeout:3000, max:-1}
};

SPRITE_STYLES[SPRITE_TYPE_DOOR_SLOT] = {
	strategy: STRATEGY_DOOR_SLOT,
	data: {key: SPRITE_TYPE_POTASSIUM, door: GROUND_TYPE_GRASS, size:4}
};
