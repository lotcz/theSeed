import {STRATEGY_EMITTER, STRATEGY_EMPTY} from "./SpriteStyleBasic";
import {SPRITE_TYPE_POTASSIUM} from "./SpriteStyleMinerals";
import {GROUND_TYPE_WAX_DOOR} from "../GroundStyle";

export const SPRITE_STYLES_SPECIAL = [];

export const SPRITE_TYPE_EXIT = 'exit';
export const STRATEGY_EXIT = 'exit';
export const IMAGE_EXIT = 'img/exit.svg';
import ExitImage from "../../../res/img/exit.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_EXIT] = {
	strategy: STRATEGY_EXIT,
	image: {
		uri: IMAGE_EXIT,
		resource: ExitImage
	},
	data: {level: 'level-0'}
};

export const SPRITE_TYPE_RESPAWN = 'respawn';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_RESPAWN] = {
	strategy: STRATEGY_EMPTY,
	data: {name: 'start'}
};

export const SPRITE_TYPE_EMITTER = 'emitter';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_EMITTER] = {
	strategy: STRATEGY_EMITTER,
	data: {type:'water', timeout:3000, max:-1}
};

export const SPRITE_TYPE_DOOR_SLOT = 'door-slot';
export const STRATEGY_DOOR_SLOT = 'door-slot';
import KeyholeImage from "../../../res/img/keyhole.svg";
export const IMAGE_KEYHOLE = 'img/keyhole.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_DOOR_SLOT] = {
	strategy: STRATEGY_DOOR_SLOT,
	data: {key: SPRITE_TYPE_POTASSIUM, door: GROUND_TYPE_WAX_DOOR, size:4},
	image: {
		uri: IMAGE_KEYHOLE,
		resource: KeyholeImage
	},
};
