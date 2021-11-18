import WaterImage from "../../res/img/water.svg";
import BubbleImage from "../../res/img/bubble.svg";
import JellymakerImage from "../../res/img/jellymaker.svg";
import HintBackgroundImage from "../../res/img/hint-background.svg";
import PotassiumImage from "../../res/img/potassium.svg";
import ButterflyImage from "../../res/img/butterfly.svg";
import BugImage from "../../res/img/bug.svg";
import BugDeadImage from "../../res/img/bug-dead.svg";
import ExitImage from "../../res/img/exit.svg";
import NitrogenImage from "../../res/img/nitrogen.svg";
import PhosphorusImage from "../../res/img/phosphorus.svg";
import HintWasdImage from "../../res/img/hint-wasd.svg";
import HintArrowsImage from "../../res/img/hint-arrows.svg";
import BeeLifeImage from "../../res/img/bee-life.svg";
import BeeDeadImage from "../../res/img/bee-dead.svg";
import BugEggImage from "../../res/img/bug-egg.svg";

import {NEIGHBOR_TYPE_UP} from "../model/GridModel";
import {GROUND_TYPE_GRASS} from "./GroundStyle";
import {MINERAL_MAX_AMOUNT} from "../strategy/sprites/minerals/MineralStrategy";

/*

import SulfurImage from "../../res/img/sulfur.svg";
import MagnesiumImage from "../../res/img/magnesium.svg";
import GrasshopperImage from "../../res/img/grasshopper.svg";
import WormHeadImage from "../../res/img/worm-head.svg";
import WormBodyImage from "../../res/img/worm-body.svg";
import WormButtImage from "../../res/img/worm-butt.svg";
*/

export const IMAGE_HINT_WASD = 'img/hint-wasd.svg';
export const IMAGE_HINT_ARROWS = 'img/hint-arrows.svg';

export const IMAGE_BEE_LIFE = 'img/bee-life.svg';
export const IMAGE_BEE = 'img/bee.svg';
export const IMAGE_BEE_DEAD = 'img/bee-dead.svg';
export const IMAGE_BEE_CRAWL = 'img/bee-walk.svg';
export const IMAGE_BEE_CRAWL_1 = 'img/bee-walk-1.svg';
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
export const IMAGE_BUG_DEAD = 'img/bug-dead.svg';
export const IMAGE_BUG_EGG = 'img/bug-egg.svg';
export const IMAGE_BUTTERFLY = 'img/butterfly.svg';
export const IMAGE_GRASSHOPPER = 'img/grasshopper.svg';
export const IMAGE_WORM_HEAD = 'img/worm-head.svg';
export const IMAGE_WORM_BODY = 'img/worm-body.svg';
export const IMAGE_WORM_BUTT = 'img/worm-butt.svg';

export const SPRITE_TYPE_LIFE = 'life';
export const SPRITE_TYPE_DEAD_BEE = 'dead-bee';
export const SPRITE_TYPE_JELLYMAKER = 'jellymaker';
export const SPRITE_TYPE_HINT = 'hint';
export const SPRITE_TYPE_HINT_WASD = 'hint-wasd';
export const SPRITE_TYPE_HINT_ARROWS = 'hint-arrows';
export const SPRITE_TYPE_BUG = 'bug';
export const SPRITE_TYPE_BUG_DEAD = 'bug-dead';
export const SPRITE_TYPE_BUG_EGG = 'bug-egg';
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

export const STRATEGY_EMPTY = 'empty';
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

export const SPRITE_STRATEGIES = [STRATEGY_STATIC, STRATEGY_EMPTY, STRATEGY_BUG, STRATEGY_WATER, STRATEGY_BUBBLE, STRATEGY_MINERAL, STRATEGY_BUTTERFLY, STRATEGY_WORM, STRATEGY_EXIT, STRATEGY_EMITTER, STRATEGY_JELLYMAKER, STRATEGY_HINT, STRATEGY_DOOR_SLOT];

export const SPRITE_STYLES = [];

SPRITE_STYLES[SPRITE_TYPE_LIFE] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_BEE_LIFE,
		resource: BeeLifeImage
	},
	data:{amount: MINERAL_MAX_AMOUNT}
};

SPRITE_STYLES[SPRITE_TYPE_DEAD_BEE] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_BEE_DEAD,
		resource: BeeDeadImage
	},
	data: {amount: MINERAL_MAX_AMOUNT}
};

SPRITE_STYLES[SPRITE_TYPE_JELLYMAKER] = {
	strategy: STRATEGY_JELLYMAKER,
	image: {
		uri: IMAGE_JELLYMAKER,
		resource: JellymakerImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP
	}
};

SPRITE_STYLES[SPRITE_TYPE_HINT] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_BACKGROUND,
		resource: HintBackgroundImage,
		scale: 0.1
	},
};

SPRITE_STYLES[SPRITE_TYPE_HINT_WASD] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_WASD,
		resource: HintWasdImage,
		scale: 0.1
	},
};

SPRITE_STYLES[SPRITE_TYPE_HINT_ARROWS] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_ARROWS,
		resource: HintArrowsImage,
		scale: 0.1
	},
};

SPRITE_STYLES[SPRITE_TYPE_BUG] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_BUG,
		resource: BugImage
	}
};

SPRITE_STYLES[SPRITE_TYPE_BUG_EGG] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_BUG_EGG,
		resource: BugEggImage
	},
	data: {amount: MINERAL_MAX_AMOUNT}
};

SPRITE_STYLES[SPRITE_TYPE_BUG_DEAD] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_BUG_DEAD,
		resource: BugDeadImage
	},
	data: {amount: MINERAL_MAX_AMOUNT}
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
	strategy: STRATEGY_EMPTY,
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
