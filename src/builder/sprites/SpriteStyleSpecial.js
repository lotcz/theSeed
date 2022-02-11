import {STRATEGY_DOOR_MOUTH_TRIGGER, STRATEGY_EMITTER, STRATEGY_EMPTY, STRATEGY_STATIC} from "./SpriteStyleBasic";
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

export const SPRITE_TYPE_DOOR_MOUTH_TRIGGER = 'door-mouth-trigger';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_DOOR_MOUTH_TRIGGER] = {
	strategy: STRATEGY_DOOR_MOUTH_TRIGGER,
};

export const SPRITE_TYPE_LEVER_ON = 'lever-on';
import LeverOnImage from "../../../res/img/lever-on.svg";
export const IMAGE_LEVER_ON = 'img/lever-on.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_LEVER_ON] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_LEVER_ON,
		resource: LeverOnImage
	}
};

export const SPRITE_TYPE_LEVER_OFF = 'lever-off';
import LeverOffImage from "../../../res/img/lever-off.svg";
export const IMAGE_LEVER_OFF = 'img/lever-off.svg';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_LEVER_OFF] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_LEVER_OFF,
		resource: LeverOffImage
	}
};

export const SPRITE_TYPE_LEVER = 'lever';
export const STRATEGY_SWITCH = 'switch';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_LEVER] = {
	strategy: STRATEGY_SWITCH,
	image: {
		uri: IMAGE_LEVER_OFF,
		resource: LeverOffImage
	},
	data: {
		imageOn: IMAGE_LEVER_ON,
		imageOff: IMAGE_LEVER_OFF
	}
};

export const SPRITE_TYPE_DOOR_LEVER = 'door-lever';

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_DOOR_LEVER] = {
	strategy: STRATEGY_SWITCH,
	image: {
		uri: IMAGE_LEVER_OFF,
		resource: LeverOffImage
	},
	data: {
		imageOn: IMAGE_LEVER_ON,
		imageOff: IMAGE_LEVER_OFF,
		controlDoors: true
	}
};

export const SPRITE_TYPE_WATER_CAP = 'water-cap';
export const IMAGE_WATER_CAP = 'img/water-cap.svg';
import WaterCapImage from "../../../res/img/water-cap.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_WATER_CAP] = {
	strategy: STRATEGY_EMITTER,
	data: {type:'water', timeout:3000, max:-1, penetrable: false, crawlable: false},
	image: {
		uri: IMAGE_WATER_CAP,
		resource: WaterCapImage,
	}
};

export const SPRITE_TYPE_SPIKE_SOIL = 'spike-soil';
export const IMAGE_SPIKE_SOIL = 'img/spike-soil.svg';
import SpikeSoilImage from "../../../res/img/spike-soil.svg";

SPRITE_STYLES_SPECIAL[SPRITE_TYPE_SPIKE_SOIL] = {
	strategy: STRATEGY_STATIC,
	data: {
		penetrable: false,
		crawlable: false,
		hits: 0.5
	},
	image: {
		uri: IMAGE_SPIKE_SOIL,
		resource: SpikeSoilImage,
	}
};
