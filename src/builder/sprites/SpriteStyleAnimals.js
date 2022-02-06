import {SPRITE_TYPE_BEE_EGG, SPRITE_TYPE_BUG_DEAD, SPRITE_TYPE_BUG_EGG} from "./SpriteStyleObjects";
import {
	SPRITE_TYPE_NECTAR, SPRITE_TYPE_NECTAR_RED,
	SPRITE_TYPE_POTASSIUM,
	SPRITE_TYPE_PURPLE_JELLY,
	SPRITE_TYPE_YELLOW_JELLY
} from "./SpriteStyleMinerals";
import {STRATEGY_DOOR_MOUTH, STRATEGY_DOOR_MOUTH_TRIGGER, STRATEGY_LARVA, STRATEGY_STATIC} from "./SpriteStyleBasic";

export const SPRITE_STYLES_ANIMALS = [];

export const SPRITE_TYPE_BUG = 'bug';
export const IMAGE_BUG = 'img/bug.svg';
export const STRATEGY_BUG = 'bug';
import BugImage from "../../../res/img/bug.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BUG] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_BUG,
		resource: BugImage
	},
	data: {
		amount: 5,
		hurts: 0.1,
		deadSprite: SPRITE_TYPE_BUG_DEAD,
		consumes: [SPRITE_TYPE_POTASSIUM],
		carries: [SPRITE_TYPE_BUG_EGG],
		repelledBy: [SPRITE_TYPE_PURPLE_JELLY],
		poisonedBy: [SPRITE_TYPE_NECTAR_RED]
	}
};

export const SPRITE_TYPE_ANT = 'ant';
export const STRATEGY_ANT = 'ant';
export const IMAGE_ANT = 'img/ant.svg';
import AntImage from "../../../res/img/ant.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_ANT] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_ANT,
		resource: AntImage
	},
	data: {
		amount: 5,
		penetrable: true,
		hurts: 0.3,
		deadSprite: SPRITE_TYPE_BUG_DEAD,
		consumes: [SPRITE_TYPE_POTASSIUM, SPRITE_TYPE_NECTAR, SPRITE_TYPE_NECTAR_RED, SPRITE_TYPE_YELLOW_JELLY],
		carries: [SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_BEE_EGG, SPRITE_TYPE_BUG_DEAD],
		repelledBy: [SPRITE_TYPE_YELLOW_JELLY]
	}
};

export const SPRITE_TYPE_BUTTERFLY = 'butterfly';
export const STRATEGY_BUTTERFLY = 'butterfly';
export const IMAGE_BUTTERFLY = 'img/butterfly.svg';
import ButterflyImage from "../../../res/img/butterfly.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BUTTERFLY] = {
	strategy: STRATEGY_BUTTERFLY,
	image: {
		uri: IMAGE_BUTTERFLY,
		resource: ButterflyImage
	}
};

export const SPRITE_TYPE_BUTTERFLY_LARVA = 'butterfly-larva';
export const IMAGE_BUTTERFLY_LARVA = 'img/butterfly-larva.svg';
import ButterflyLarvaImage from "../../../res/img/butterfly-larva.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BUTTERFLY_LARVA] = {
	strategy: STRATEGY_LARVA,
	image: {
		uri: IMAGE_BUTTERFLY_LARVA,
		resource: ButterflyLarvaImage
	},
	data: {amount: 5, penetrable: false, timeout: 5000}
};

export const SPRITE_TYPE_TOAD = 'toad';
export const STRATEGY_TOAD = 'toad';
export const IMAGE_TOAD_HEAD = 'img/toad-head.svg';
import ToadHeadImage from "../../../res/img/toad-head.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD] = {
	strategy: STRATEGY_TOAD,
	image: {
		uri: IMAGE_TOAD_HEAD,
		resource: ToadHeadImage
	},
};

export const SPRITE_TYPE_TOAD_BODY = 'toad-body';
export const IMAGE_TOAD_BODY = 'img/toad-body.svg';
import ToadBodyImage from "../../../res/img/toad-body.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD_BODY] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_TOAD_BODY,
		resource: ToadBodyImage
	},
};

export const SPRITE_TYPE_TOAD_TONGUE = 'toad-tongue';
export const IMAGE_TOAD_TONGUE = 'img/toad-tongue.svg';
import ToadTongueImage from "../../../res/img/toad-tongue.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD_TONGUE] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_TOAD_TONGUE,
		resource: ToadTongueImage
	},
};

export const SPRITE_TYPE_TOAD_HEAD_OPEN = 'toad-head-open';
export const IMAGE_TOAD_HEAD_OPEN = 'img/toad-head-open.svg';
import ToadHeadOpenImage from "../../../res/img/toad-head-open.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_TOAD_HEAD_OPEN] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_TOAD_HEAD_OPEN,
		resource: ToadHeadOpenImage
	},
};

export const SPRITE_TYPE_CARNI_PLANT_MOUTH = 'carni-plant-mouth';
export const IMAGE_CARNI_PLANT_MOUTH  = 'img/carni-plant-mouth.svg';
import CarniPlantMouthImage from "../../../res/img/carni-plant-mouth.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_CARNI_PLANT_MOUTH] = {
	strategy: STRATEGY_DOOR_MOUTH,
	image: {
		uri: IMAGE_CARNI_PLANT_MOUTH,
		resource: CarniPlantMouthImage
	},
};

export const SPRITE_TYPE_CARNI_PLANT = 'carnivorous-plant';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_CARNI_PLANT] = {
	strategy: STRATEGY_DOOR_MOUTH_TRIGGER
};
