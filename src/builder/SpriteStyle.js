import WaterImage from "../../res/img/water.svg";
import BubbleImage from "../../res/img/bubble.svg";
import HintBackgroundImage from "../../res/img/hint-background.svg";
import PotassiumImage from "../../res/img/potassium.svg";
import ButterflyImage from "../../res/img/butterfly.svg";
import ExitImage from "../../res/img/exit.svg";


import BugEggImage from "../../res/img/bug-egg.svg";
import BugDeadImage from "../../res/img/bug-dead.svg";

import BeeLifeImage from "../../res/img/bee-life.svg";
import BeeDeadImage from "../../res/img/bee-dead.svg";
import BeeQueenImage from "../../res/img/bee-queen.svg";

import {NEIGHBOR_TYPE_UP} from "../model/GridModel";
import {GROUND_TYPE_GRASS, GROUND_TYPE_WAX_DOOR} from "./GroundStyle";
import {MINERAL_MAX_AMOUNT} from "../strategy/sprites/minerals/MineralStrategy";
import {DEFAULT_OBJECT_MAX_AMOUNT} from "../strategy/sprites/ObjectStrategy";



export const IMAGE_BEE = 'img/bee.svg';
export const IMAGE_BEE_CRAWL = 'img/bee-walk.svg';
export const IMAGE_BEE_CRAWL_1 = 'img/bee-walk-1.svg';
export const IMAGE_BEE_WING = 'img/wing.svg';

export const IMAGE_BEE_LIFE = 'img/bee-life.svg';
export const IMAGE_BEE_DEAD = 'img/bee-dead.svg';
export const IMAGE_BEE_QUEEN = 'img/bee-queen.svg';

export const IMAGE_STARS_1 = 'img/stars-1.svg';
export const IMAGE_STARS_2 = 'img/stars-2.svg';
export const IMAGE_STARS_3 = 'img/stars-3.svg';

export const IMAGE_HINT_BACKGROUND = 'img/hint-background.svg';
export const IMAGE_EXIT = 'img/exit.svg';

export const IMAGE_WATER = 'img/water.svg';
export const IMAGE_BUBBLE = 'img/bubble.svg';
export const IMAGE_NITROGEN = 'img/nitrogen.svg';
export const IMAGE_POTASSIUM = 'img/potassium.svg';

export const IMAGE_BUG_DEAD = 'img/bug-dead.svg';
export const IMAGE_BUG_EGG = 'img/bug-egg.svg';
export const IMAGE_BUTTERFLY = 'img/butterfly.svg';

export const SPRITE_TYPE_RANDOM = 'random';

export const SPRITE_TYPE_BEE_LIFE = 'bee-life';
export const SPRITE_TYPE_BEE_DEAD = 'bee-dead';
export const SPRITE_TYPE_BEE_QUEEN = 'bee-queen';

export const SPRITE_TYPE_HINT = 'hint';


export const SPRITE_TYPE_BUG_DEAD = 'bug-dead';
export const SPRITE_TYPE_BUG_EGG = 'bug-egg';
export const SPRITE_TYPE_BUTTERFLY = 'butterfly';
export const SPRITE_TYPE_WATER = 'water';
export const SPRITE_TYPE_BUBBLE = 'bubble';
export const SPRITE_TYPE_POTASSIUM = 'potassium';
export const SPRITE_TYPE_RESPAWN = 'respawn';
export const SPRITE_TYPE_EXIT = 'exit';
export const SPRITE_TYPE_EMITTER = 'emitter';


export const STRATEGY_EMPTY = 'empty';
export const STRATEGY_STATIC = 'static';
export const STRATEGY_OBJECT = 'object';
export const STRATEGY_HINT = 'hint';
export const STRATEGY_MINERAL = 'mineral';
export const STRATEGY_QUEEN = 'queen';

export const STRATEGY_BUTTERFLY = 'butterfly';
export const STRATEGY_WORM = 'worm';
export const STRATEGY_BUBBLE = 'bubble';
export const STRATEGY_WATER = 'water';

export const STRATEGY_EMITTER = 'emitter';


export const SPRITE_STYLES = [];

/*
SPECIAL
 */

export const SPRITE_TYPE_DOOR_SLOT = 'door-slot';
export const STRATEGY_DOOR_SLOT = 'door-slot';
import KeyholeImage from "../../res/img/keyhole.svg";
export const IMAGE_KEYHOLE = 'img/keyhole.svg';

SPRITE_STYLES[SPRITE_TYPE_DOOR_SLOT] = {
	strategy: STRATEGY_DOOR_SLOT,
	data: {key: SPRITE_TYPE_POTASSIUM, door: GROUND_TYPE_WAX_DOOR, size:4},
	image: {
		uri: IMAGE_KEYHOLE,
		resource: KeyholeImage
	},
};

SPRITE_STYLES[SPRITE_TYPE_RESPAWN] = {
	strategy: STRATEGY_EMPTY,
	data: {name: 'start'}
};

export const STRATEGY_EXIT = 'exit';

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


SPRITE_STYLES[SPRITE_TYPE_HINT] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_BACKGROUND,
		resource: HintBackgroundImage,
		scale: 0.1
	},
};

export const SPRITE_TYPE_HINT_WASD = 'hint-wasd';
export const IMAGE_HINT_WASD = 'img/hint-wasd.svg';
import HintWasdImage from "../../res/img/hint-wasd.svg";


SPRITE_STYLES[SPRITE_TYPE_HINT_WASD] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_WASD,
		resource: HintWasdImage,
		scale: 0.1
	},
};

export const SPRITE_TYPE_HINT_ARROWS = 'hint-arrows';
export const IMAGE_HINT_ARROWS = 'img/hint-arrows.svg';
import HintArrowsImage from "../../res/img/hint-arrows.svg";

SPRITE_STYLES[SPRITE_TYPE_HINT_ARROWS] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_ARROWS,
		resource: HintArrowsImage,
		scale: 0.1
	},
};

export const SPRITE_TYPE_HINT_WATER = 'hint-water';
export const IMAGE_HINT_WATER = 'img/hint-water.svg';
import HintWaterImage from "../../res/img/hint-water.svg";

SPRITE_STYLES[SPRITE_TYPE_HINT_WATER] = {
	strategy: STRATEGY_HINT,
	image: {
		uri: IMAGE_HINT_WATER,
		resource: HintWaterImage,
		scale: 0.1
	},
};

/*
Minerals and other objects
 */

export const SPRITE_TYPE_STONE = 'stone';
import StoneImage from "../../res/img/stone.svg";
export const IMAGE_STONE = 'img/stone.svg';

SPRITE_STYLES[SPRITE_TYPE_STONE] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_STONE,
		resource: StoneImage
	},
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

export const SPRITE_TYPE_BEE_EGG = 'bee-egg';
export const IMAGE_BEE_EGG = 'img/bee-egg.svg';
import BeeEggImage from "../../res/img/bee-egg.svg";

SPRITE_STYLES[SPRITE_TYPE_BEE_EGG] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_EGG,
		resource: BeeEggImage,
		scale: 0.5
	},
	data: {amount: DEFAULT_OBJECT_MAX_AMOUNT}
};

export const SPRITE_TYPE_BEE_BROKEN_EGG = 'bee-egg-broken';
export const IMAGE_BEE_BROKEN_EGG = 'img/bee-egg-broken.svg';
import BeeBrokenEggImage from "../../res/img/bee-egg-broken.svg";

SPRITE_STYLES[SPRITE_TYPE_BEE_BROKEN_EGG] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_BROKEN_EGG,
		resource: BeeBrokenEggImage
	},
	data: {amount: DEFAULT_OBJECT_MAX_AMOUNT}
};

export const SPRITE_TYPE_BEE_LARVA = 'bee-larva';
export const IMAGE_BEE_LARVA = 'img/bee-larva.svg';
import BeeLarvaImage from "../../res/img/bee-larva.svg";

SPRITE_STYLES[SPRITE_TYPE_BEE_LARVA] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_LARVA,
		resource: BeeLarvaImage,
		scale: 0.5
	},
	data: {amount: DEFAULT_OBJECT_MAX_AMOUNT}
};

export const SPRITE_TYPE_POLLEN = 'pollen';
export const IMAGE_POLLEN = 'img/pollen.svg';
import PollenImage from "../../res/img/pollen.svg";

SPRITE_STYLES[SPRITE_TYPE_POLLEN] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_POLLEN,
		resource: PollenImage,
		scale: 0.01
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_NECTAR = 'nectar';
export const IMAGE_NECTAR = 'img/nectar.svg';
import NectarImage from "../../res/img/nectar.svg";

SPRITE_STYLES[SPRITE_TYPE_NECTAR] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_NECTAR,
		resource: NectarImage,
		scale: 0.01
	},
	data: {amount: 1}
};

export const SPRITE_TYPE_PINK_JELLY = 'jelly-pink';
export const IMAGE_PINK_JELLY = 'img/pink-jelly.svg';
import PinkJellyImage from "../../res/img/pink-jelly.svg";

SPRITE_STYLES[SPRITE_TYPE_PINK_JELLY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_PINK_JELLY,
		resource: PinkJellyImage
	},
	data: {
		amount: 1
	}
};

export const SPRITE_TYPE_GREEN_JELLY = 'jelly-green';
export const IMAGE_GREEN_JELLY = 'img/green-jelly.svg';
import GreenJellyImage from "../../res/img/green-jelly.svg";

SPRITE_STYLES[SPRITE_TYPE_GREEN_JELLY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_GREEN_JELLY,
		resource: GreenJellyImage
	},
	data: {
		amount: 1
	}
};

export const SPRITE_TYPE_YELLOW_JELLY = 'jelly-yellow';
export const IMAGE_YELLOW_JELLY = 'img/yellow-jelly.svg';
import YellowJellyImage from "../../res/img/yellow-jelly.svg";

SPRITE_STYLES[SPRITE_TYPE_YELLOW_JELLY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_YELLOW_JELLY,
		resource: YellowJellyImage
	},
	data: {
		amount: 1
	}
};

export const SPRITE_TYPE_HONEY = 'honey';
export const IMAGE_HONEY = 'img/honey.svg';
import HoneyImage from "../../res/img/honey.svg";

SPRITE_STYLES[SPRITE_TYPE_HONEY] = {
	strategy: STRATEGY_MINERAL,
	image: {
		uri: IMAGE_HONEY,
		resource: HoneyImage
	},
	data: {
		amount: 1
	}
};

/*
BEES
 */

SPRITE_STYLES[SPRITE_TYPE_BEE_LIFE] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_BEE_LIFE,
		resource: BeeLifeImage
	},
	data:{amount: MINERAL_MAX_AMOUNT}
};

SPRITE_STYLES[SPRITE_TYPE_BEE_DEAD] = {
	strategy: STRATEGY_OBJECT,
	image: {
		uri: IMAGE_BEE_DEAD,
		resource: BeeDeadImage
	},
	data: {amount: DEFAULT_OBJECT_MAX_AMOUNT}
};

export const STRATEGY_JELLY_MAKER = 'jellymaker';

export const SPRITE_TYPE_PINK_JELLY_MAKER = 'bee-jelly-maker-pink';
export const IMAGE_PINK_JELLY_MAKER = 'img/jellymaker.svg';
import PinkJellyMakerImage from "../../res/img/pink-jelly-maker.svg";

SPRITE_STYLES[SPRITE_TYPE_PINK_JELLY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_PINK_JELLY_MAKER,
		resource: PinkJellyMakerImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_POLLEN,
		produces: SPRITE_TYPE_PINK_JELLY
	}
};

export const SPRITE_TYPE_GREEN_JELLY_MAKER = 'bee-jelly-maker-green';
export const IMAGE_GREEN_JELLY_MAKER = 'img/green-jelly-maker.svg';
import GreenJellyMakerImage from "../../res/img/green-jelly-maker.svg";

SPRITE_STYLES[SPRITE_TYPE_GREEN_JELLY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_GREEN_JELLY_MAKER,
		resource: GreenJellyMakerImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_POTASSIUM,
		produces: SPRITE_TYPE_GREEN_JELLY
	}
};

export const SPRITE_TYPE_YELLOW_JELLY_MAKER = 'bee-jelly-maker-yellow';
export const IMAGE_YELLOW_JELLY_MAKER = 'img/yellow-jelly-maker.svg';
import YellowJellyMakerImage from "../../res/img/yellow-jelly-maker.svg";

SPRITE_STYLES[SPRITE_TYPE_YELLOW_JELLY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_YELLOW_JELLY_MAKER,
		resource: YellowJellyMakerImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_NECTAR,
		produces: SPRITE_TYPE_YELLOW_JELLY
	}
};

export const SPRITE_TYPE_HONEY_MAKER = 'bee-honey-maker';
export const IMAGE_HONEY_MAKER = 'img/honey-maker.svg';
import HoneyMakerImage from "../../res/img/honey-maker.svg";

SPRITE_STYLES[SPRITE_TYPE_HONEY_MAKER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_HONEY_MAKER,
		resource: HoneyMakerImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		consumes: SPRITE_TYPE_YELLOW_JELLY,
		produces: SPRITE_TYPE_HONEY
	}
};

SPRITE_STYLES[SPRITE_TYPE_BEE_QUEEN] = {
	strategy: STRATEGY_QUEEN,
	image: {
		uri: IMAGE_BEE_QUEEN,
		resource: BeeQueenImage
	}
};

/*
Bugs and Animals
 */

export const SPRITE_TYPE_BUG = 'bug';
export const IMAGE_BUG = 'img/bug.svg';
export const STRATEGY_BUG = 'bug';
import BugImage from "../../res/img/bug.svg";

SPRITE_STYLES[SPRITE_TYPE_BUG] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_BUG,
		resource: BugImage
	},
	data: {amount: 1}
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

export const SPRITE_STRATEGIES = [STRATEGY_STATIC, STRATEGY_EMPTY, STRATEGY_OBJECT, STRATEGY_BUG, STRATEGY_WATER, STRATEGY_BUBBLE, STRATEGY_MINERAL, STRATEGY_BUTTERFLY, STRATEGY_WORM, STRATEGY_EXIT, STRATEGY_EMITTER, STRATEGY_JELLY_MAKER, STRATEGY_HINT, STRATEGY_DOOR_SLOT, STRATEGY_QUEEN].sort();
