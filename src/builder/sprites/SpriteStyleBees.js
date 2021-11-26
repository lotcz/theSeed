import {IMAGE_HINT_KEYHOLE_1, IMAGE_HINT_KEYHOLE_2} from "./SpriteStyleHints";
import {NEIGHBOR_TYPE_UP, NEIGHBOR_TYPE_UPPER_LEFT} from "../../model/GridModel";
import {STRATEGY_JELLY_MAKER} from "./SpriteStyleBasic";
import {
	IMAGE_POLLEN_PURPLE,
	SPRITE_TYPE_GREEN_JELLY,
	SPRITE_TYPE_HONEY,
	SPRITE_TYPE_NECTAR,
	SPRITE_TYPE_PINK_JELLY,
	SPRITE_TYPE_POLLEN,
	SPRITE_TYPE_POTASSIUM,
	SPRITE_TYPE_YELLOW_JELLY
} from "./SpriteStyleMinerals";

export const SPRITE_STYLES_BEES = [];

export const IMAGE_BEE = 'img/bee.svg';
export const IMAGE_BEE_CRAWL = 'img/bee-walk.svg';
export const IMAGE_BEE_CRAWL_1 = 'img/bee-walk-1.svg';
export const IMAGE_BEE_WING = 'img/wing.svg';
export const IMAGE_STARS_1 = 'img/stars-1.svg';
export const IMAGE_STARS_2 = 'img/stars-2.svg';
export const IMAGE_STARS_3 = 'img/stars-3.svg';

export const SPRITE_TYPE_BEE_FRIEND = 'bee-friend';
export const IMAGE_BEE_FRIEND = 'img/bee-friend.svg';
import BeeFriendImage from "../../../res/img/bee-friend.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_FRIEND] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_BEE_FRIEND,
		resource: BeeFriendImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UP,
		hint: [IMAGE_HINT_KEYHOLE_1, IMAGE_HINT_KEYHOLE_2]
	}
};

export const SPRITE_TYPE_BEE_SOLDIER = 'bee-soldier';
export const IMAGE_BEE_SOLDIER = 'img/bee-soldier.svg';
import BeeSoldierImage from "../../../res/img/bee-soldier.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_SOLDIER] = {
	strategy: STRATEGY_JELLY_MAKER,
	image: {
		uri: IMAGE_BEE_SOLDIER,
		resource: BeeSoldierImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UPPER_LEFT,
		hint: [IMAGE_POLLEN_PURPLE],
		hintSize: 5
	}
};

export const SPRITE_TYPE_PINK_JELLY_MAKER = 'bee-jelly-maker-pink';
export const IMAGE_PINK_JELLY_MAKER = 'img/jellymaker.svg';
import PinkJellyMakerImage from "../../../res/img/pink-jelly-maker.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_PINK_JELLY_MAKER] = {
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
import GreenJellyMakerImage from "../../../res/img/green-jelly-maker.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_GREEN_JELLY_MAKER] = {
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
import YellowJellyMakerImage from "../../../res/img/yellow-jelly-maker.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_YELLOW_JELLY_MAKER] = {
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
import HoneyMakerImage from "../../../res/img/honey-maker.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_HONEY_MAKER] = {
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

export const IMAGE_BEE_QUEEN = 'img/bee-queen.svg';
export const STRATEGY_QUEEN = 'queen';
export const SPRITE_TYPE_BEE_QUEEN = 'bee-queen';
import BeeQueenImage from "../../../res/img/bee-queen.svg";

SPRITE_STYLES_BEES[SPRITE_TYPE_BEE_QUEEN] = {
	strategy: STRATEGY_QUEEN,
	image: {
		uri: IMAGE_BEE_QUEEN,
		resource: BeeQueenImage
	}
};
