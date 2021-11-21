import StalkImage from "../../res/img/stalk.svg";
import GrassImage from "../../res/img/grass.svg";
import TreesImage from "../../res/img/trees.svg";
import BulbsImage from "../../res/img/bulbs.svg";

import {BLUE_DARK, BLUE_LIGHT, BROWN_LIGHT} from "./Palette";

export const PARALLAX_HILLS = 'hills';
export const PARALLAX_SOIL = 'soil';

export const PARALLAX_IMAGE_GRASS = 'img/grass.svg';
export const PARALLAX_IMAGE_STALK = 'img/stalk.svg';
export const PARALLAX_IMAGE_TREES = 'img/trees.svg';
export const PARALLAX_IMAGE_BULBS = 'img/bulbs.svg';

export const PARALLAX_STYLES = [];

PARALLAX_STYLES[PARALLAX_HILLS] = {
	background: BLUE_LIGHT,
	backgroundEnd: BLUE_DARK,
	layers: [
		{
			distance: 0.8,
			image: {
				uri: PARALLAX_IMAGE_STALK,
				resource: StalkImage
			}
		},
		{
			distance: 0.7,
			image: {
				uri: PARALLAX_IMAGE_TREES,
				resource: TreesImage
			}
		},
		{
			distance: 0.4,
			image: {
				uri: PARALLAX_IMAGE_BULBS,
				resource: BulbsImage
			}
		},
		{
			distance: 0.3,
			image: {
				uri: PARALLAX_IMAGE_GRASS,
				resource: GrassImage
			}
		}
	]
};

PARALLAX_STYLES[PARALLAX_SOIL] = {
	background: BROWN_LIGHT,
	backgroundEnd: BROWN_LIGHT,
};
