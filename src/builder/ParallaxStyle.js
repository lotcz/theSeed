import HillImage from "../../res/img/hill.svg";
/*
import StalkImage from "../../res/img/stalk.svg";
import GrassImage from "../../res/img/grass.svg";
import TreesImage from "../../res/img/trees.svg";
import EggHillsImage from "../../res/img/egghills.svg";
import BulbsImage from "../../res/img/bulbs.svg";
import RockImage from '../../res/img/rock.svg';
*/

import {BLUE_DARK, BLUE_LIGHT, BROWN_LIGHT, BROWN_MEDIUM} from "./Palette";

export const PARALLAX_HILLS = 'hills';
export const PARALLAX_SOIL = 'soil';

export const PARALLAX_IMAGE_HILL = 'img/hill.svg';
export const PARALLAX_IMAGE_STALK = 'img/stalk.svg';
export const PARALLAX_IMAGE_TREES = 'img/trees.svg';
export const PARALLAX_IMAGE_BULBS = 'img/bulbs.svg';
export const PARALLAX_IMAGE_PLANT = 'img/plant.svg';

export const PARALLAX_STYLES = [];

PARALLAX_STYLES[PARALLAX_HILLS] = {
	background: BLUE_LIGHT,
	backgroundEnd: BLUE_DARK,
	layers: [
		{
			distance: 0.5,
			image: {
				uri: PARALLAX_IMAGE_HILL,
				resource: HillImage
			}
		}
	]
};

PARALLAX_STYLES[PARALLAX_SOIL] = {
	background: BROWN_LIGHT,
	backgroundEnd: BROWN_LIGHT,
};
