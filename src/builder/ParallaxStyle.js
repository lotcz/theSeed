import HillImage from "../../res/img/hill.svg";
import StalkImage from "../../res/img/stalk.svg";
import GrassImage from "../../res/img/grass.svg";
import TreesImage from "../../res/img/trees.svg";
import EggHillsImage from "../../res/img/egghills.svg";
import BulbsImage from "../../res/img/bulbs.svg";
import PlantImage from '../../res/img/plant.svg';
import RockImage from '../../res/img/rock.svg';

export const PARALLAX_HILL = 'img/hill.svg';
export const PARALLAX_STALK = 'img/stalk.svg';
export const PARALLAX_TREES = 'img/trees.svg';
export const PARALLAX_BULBS = 'img/bulbs.svg';
export const PARALLAX_PLANT = 'img/plant.svg';

export const PARALLAX_STYLES = [];

PARALLAX_STYLES[PARALLAX_HILL] = {
	distance: 0.5,
	image: {
		uri: PARALLAX_HILL,
		resource: HillImage
	}
};
