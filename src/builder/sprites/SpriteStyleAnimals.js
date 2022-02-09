import {SPRITE_TYPE_BEE_EGG, SPRITE_TYPE_BUG_DEAD, SPRITE_TYPE_BUG_EGG} from "./SpriteStyleObjects";
import {NEIGHBOR_TYPE_UPPER_LEFT} from "../../model/GridModel";

import {
	SPRITE_TYPE_NECTAR, SPRITE_TYPE_NECTAR_RED,
	SPRITE_TYPE_POTASSIUM,
	SPRITE_TYPE_PURPLE_JELLY,
	SPRITE_TYPE_YELLOW_JELLY
} from "./SpriteStyleMinerals";
import {
	STRATEGY_DOOR_MOUTH,
	STRATEGY_FLYING_BUG,
	STRATEGY_LARVA,
	STRATEGY_STATIC
} from "./SpriteStyleBasic";

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

export const SPRITE_TYPE_STAG_BEETLE = 'stag-beetle';
export const IMAGE_STAG_BEETLE = 'img/stag-beetle.svg';
import StagBeetleImage from "../../../res/img/stag-beetle.svg";

export const IMAGE_STAG_BEETLE_WALKING_1 = 'img/stag-beetle-walk-1.svg';
import StagBeetleWalking1Image from "../../../res/img/stag-beetle-walk-1.svg";
export const IMAGE_STAG_BEETLE_WALKING_2 = 'img/stag-beetle-walk-2.svg';
import StagBeetleWalking2Image from "../../../res/img/stag-beetle-walk-2.svg";

export const IMAGE_STAG_BEETLE_ATTACKING_1 = 'img/stag-beetle-attack-1.svg';
import StagBeetleAttacking1Image from "../../../res/img/stag-beetle-attack-1.svg";
export const IMAGE_STAG_BEETLE_ATTACKING_2 = 'img/stag-beetle-attack-2.svg';
import StagBeetleAttacking2Image from "../../../res/img/stag-beetle-attack-2.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_STAG_BEETLE] = {
	strategy: STRATEGY_BUG,
	image: {
		uri: IMAGE_STAG_BEETLE,
		resource: StagBeetleImage
	},
	data: {
		amount: BUG_MAX_AMOUNT,
		penetrable: false,
		hurts: 0,
		deadSprite: SPRITE_TYPE_BUG_DEAD,
		consumes: [SPRITE_TYPE_POTASSIUM, SPRITE_TYPE_NECTAR, SPRITE_TYPE_NECTAR_RED, SPRITE_TYPE_YELLOW_JELLY],
		carries: [SPRITE_TYPE_BUG_EGG, SPRITE_TYPE_BEE_EGG, SPRITE_TYPE_BUG_DEAD],
		repelledBy: [SPRITE_TYPE_YELLOW_JELLY]
	},
	animations: {
		walking: [
			{
				uri: IMAGE_STAG_BEETLE,
				resource: StagBeetleImage,
				frameRate: 5
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_2,
				resource: StagBeetleWalking2Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			}
		],
		attacking: [
			{
				uri: IMAGE_STAG_BEETLE,
				resource: StagBeetleImage,
				frameRate: 10
			},
			{
				uri: IMAGE_STAG_BEETLE_ATTACKING_1,
				resource: StagBeetleAttacking1Image
			},
			{
				uri: IMAGE_STAG_BEETLE_ATTACKING_2,
				resource: StagBeetleAttacking2Image
			},
			{
				uri: IMAGE_STAG_BEETLE_ATTACKING_1,
				resource: StagBeetleAttacking1Image
			}
		],
		running: [
			{
				uri: IMAGE_STAG_BEETLE,
				resource: StagBeetleImage,
				frameRate: 15
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_2,
				resource: StagBeetleWalking2Image
			},
			{
				uri: IMAGE_STAG_BEETLE_WALKING_1,
				resource: StagBeetleWalking1Image
			}
		]
	}
};

export const SPRITE_TYPE_ANT = 'ant';
export const STRATEGY_ANT = 'ant';
export const IMAGE_ANT = 'img/ant.svg';
import AntImage from "../../../res/img/ant.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_ANT] = {
	strategy: STRATEGY_ANT,
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

export const IMAGE_BUTTERFLY = 'img/butterfly.svg';
import ButterflyImage from "../../../res/img/butterfly.svg";

export const IMAGE_BUTTERFLY_FLYING_1 = 'img/butterfly-flight-1.svg';
import ButterflyFlying1Image from "../../../res/img/butterfly-flight-1.svg";
export const IMAGE_BUTTERFLY_FLYING_2 = 'img/butterfly-flight-2.svg';
import ButterflyFlying2Image from "../../../res/img/butterfly-flight-2.svg";
export const IMAGE_BUTTERFLY_FLYING_3 = 'img/butterfly-flight-3.svg';
import ButterflyFlying3Image from "../../../res/img/butterfly-flight-3.svg";

export const SPRITE_TYPE_BUTTERFLY = 'butterfly';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_BUTTERFLY] = {
	strategy: STRATEGY_FLYING_BUG,
	data: {
		size: 2
	},
	image: {
		uri: IMAGE_BUTTERFLY,
		resource: ButterflyImage
	},
	animations: {
		flying: [
			{
				uri: IMAGE_BUTTERFLY_FLYING_1,
				resource: ButterflyFlying1Image,
				frameRate: 5
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_3,
				resource: ButterflyFlying3Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			}
		],
		landing: [
			{
				uri: IMAGE_BUTTERFLY_FLYING_1,
				resource: ButterflyFlying1Image,
				frameRate: 3
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_3,
				resource: ButterflyFlying3Image
			},
			{
				uri: IMAGE_BUTTERFLY_FLYING_2,
				resource: ButterflyFlying2Image
			}
		]
	}
};

export const IMAGE_HORNET = 'img/hornet.svg';
import HornetImage from "../../../res/img/hornet.svg";

export const IMAGE_HORNET_FLIGHT_1 = 'img/hornet-flight-1.svg';
import HornetFlight1Image from "../../../res/img/hornet-flight-1.svg";
export const IMAGE_HORNET_FLIGHT_2 = 'img/hornet-flight-2.svg';
import HornetFlight2Image from "../../../res/img/hornet-flight-2.svg";
export const IMAGE_HORNET_FLIGHT_3 = 'img/hornet-flight-3.svg';
import HornetFlight3Image from "../../../res/img/hornet-flight-3.svg";

export const IMAGE_HORNET_LANDING_1 = 'img/hornet-landing-1.svg';
import HornetLanding1Image from "../../../res/img/hornet-landing-1.svg";
export const IMAGE_HORNET_LANDING_2 = 'img/hornet-landing-2.svg';
import HornetLanding2Image from "../../../res/img/hornet-landing-2.svg";

export const IMAGE_HORNET_ATTACKING_1 = 'img/hornet-attack-1.svg';
import HornetAttacking1Image from "../../../res/img/hornet-attack-1.svg";
export const IMAGE_HORNET_ATTACKING_2 = 'img/hornet-attack-2.svg';
import HornetAttacking2Image from "../../../res/img/hornet-attack-2.svg";

export const SPRITE_TYPE_HORNET = 'hornet';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_HORNET] = {
	strategy: STRATEGY_FLYING_BUG,
	data: {
		size: 2,
		hurts: 0.04
	},
	image: {
		uri: IMAGE_HORNET,
		resource: HornetImage
	},
	animations: {
		flying: [
			{
				uri: IMAGE_HORNET_FLIGHT_1,
				resource: HornetFlight1Image,
				frameRate: 60
			},
			{
				uri: IMAGE_HORNET_FLIGHT_2,
				resource: HornetFlight2Image
			},
			{
				uri: IMAGE_HORNET_FLIGHT_3,
				resource: HornetFlight3Image
			},
			{
				uri: IMAGE_HORNET_FLIGHT_2,
				resource: HornetFlight2Image
			},
		],
		landing: [
			{
				uri: IMAGE_HORNET_LANDING_1,
				resource: HornetLanding1Image,
				frameRate: 5
			},
			{
				uri: IMAGE_HORNET_LANDING_2,
				resource: HornetLanding2Image
			}
		],
		attacking: [
			{
				uri: IMAGE_HORNET_ATTACKING_1,
				resource: HornetAttacking1Image,
				frameRate: 5
			},
			{
				uri: IMAGE_HORNET_ATTACKING_2,
				resource: HornetAttacking2Image
			}
		]
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
import {BUG_MAX_AMOUNT} from "../../strategy/sprites/animals/BugStrategy";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_CARNI_PLANT_MOUTH] = {
	strategy: STRATEGY_DOOR_MOUTH,
	image: {
		uri: IMAGE_CARNI_PLANT_MOUTH,
		resource: CarniPlantMouthImage
	},
};


export const SPRITE_TYPE_GRASSHOPPER_BODY = 'grasshopper-body';
export const IMAGE_GRASSHOPPER_BODY = 'img/grasshopper-body.svg';
import GrasshopperBodyImage from "../../../res/img/grasshopper-body.svg";

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_GRASSHOPPER_BODY] = {
	strategy: STRATEGY_STATIC,
	image: {
		uri: IMAGE_GRASSHOPPER_BODY,
		resource: GrasshopperBodyImage
	}
};

export const SPRITE_TYPE_GRASSHOPPER = 'grasshopper';
export const IMAGE_GRASSHOPPER_HEAD = 'img/grasshopper-head.svg';
import GrasshopperHeadImage from "../../../res/img/grasshopper-head.svg";
export const STRATEGY_GRASSHOPPER = 'grasshopper';

SPRITE_STYLES_ANIMALS[SPRITE_TYPE_GRASSHOPPER] = {
	strategy: STRATEGY_GRASSHOPPER,
	image: {
		uri: IMAGE_GRASSHOPPER_HEAD,
		resource: GrasshopperHeadImage
	},
	data: {
		hintDirection: NEIGHBOR_TYPE_UPPER_LEFT,
	}
};
