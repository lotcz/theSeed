import {
	BLUE_MEDIUM,
	BROWN_DARK,
	BROWN_LIGHT,
	BROWN_LIGHTEST,
	BROWN_MEDIUM,
	GRAY_DARK,
	GRAY_DARKEST,
	GRAY_LIGHT,
	GRAY_MEDIUM,
	GREEN_DARK,
	GREEN_LIGHT,
	GREEN_LIGHTEST, ORANGE_DARK, ORANGE_DARKEST, ORANGE_MEDIUM, YELLOW_DARK, YELLOW_DARKEST, YELLOW_MEDIUM
} from "./Palette";

export const GROUND_TYPE_BASIC = 'basic';
export const GROUND_TYPE_SOIL = 'soil';
export const GROUND_TYPE_WOOD = 'wood';
export const GROUND_TYPE_ROCK = 'rock';
export const GROUND_TYPE_GRASS = 'grass';
export const GROUND_TYPE_HONEY = 'honey';
export const GROUND_TYPE_WAX = 'wax';
export const GROUND_TYPE_WATER = 'water';
export const GROUND_TYPE_CLOUD = 'cloud';
export const GROUND_TYPE_SOIL_BACKGROUND = 'background-soil';
export const GROUND_TYPE_ROCK_BACKGROUND = 'background-rock';
export const GROUND_TYPE_WAX_BACKGROUND = 'background-wax';
export const GROUND_TYPE_GRASS_BACKGROUND = 'background-grass';

export const GROUND_STYLES = [];

GROUND_STYLES[GROUND_TYPE_BASIC] = {
	fill: GRAY_DARK,
	stroke: { width: 10, color: GRAY_DARKEST},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_SOIL] = {
	fill: BROWN_MEDIUM,
	stroke: { width: 10, color: BROWN_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WOOD] = {
	fill: BROWN_LIGHTEST,
	stroke: { width: 4, color: BROWN_MEDIUM},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_ROCK] = {
	fill: GRAY_MEDIUM,
	stroke: { width: 10, color: GRAY_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_GRASS] = {
	fill: GREEN_LIGHT,
	stroke: { width: 10, color: GREEN_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_HONEY] = {
	fill: 'orange',
	stroke: { width: 140, color: 'darkOrange', linejoin: 'round'},
	background: true
};

GROUND_STYLES[GROUND_TYPE_WAX] = {
	fill: ORANGE_DARK,
	stroke: { width: 10, color: ORANGE_DARKEST},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WATER] = {
	fill: BLUE_MEDIUM,
	stroke: { width: 160, color: BLUE_MEDIUM},
	background: true,
	penetrable: true
};

GROUND_STYLES[GROUND_TYPE_CLOUD] = {
	fill: 'rgba(255, 255, 255, 0.3)',
	stroke: { width: 0},
	background: true,
	penetrable: true
};

GROUND_STYLES[GROUND_TYPE_ROCK_BACKGROUND] = {
	fill: GRAY_LIGHT,
	stroke: { width: 0},
	background: true,
	penetrable: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_SOIL_BACKGROUND] = {
	fill: BROWN_LIGHT,
	stroke: { width: 20, color: BROWN_LIGHT},
	background: true,
	penetrable: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WAX_BACKGROUND] = {
	fill: '#e49665',
	stroke: { width: 20, color: '#e49665'},
	background: true,
	penetrable: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_GRASS_BACKGROUND] = {
	fill: GREEN_LIGHTEST,
	stroke: { width: 20, color: GREEN_LIGHTEST},
	background: true,
	penetrable: true,
	renderCorners: true
};
