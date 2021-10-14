export const SKY_LIGHT = '#a3d2fe';
export const SKY_DARK = '#6483bc';

export const GRAY_DARKEST = '#101010';
export const GRAY_DARK = '#313131';
export const GRAY_MEDIUM = '#606060';
export const GRAY_LIGHT = '#a0a0a0';
export const GRAY_LIGHTEST = '#c0c0c0';

export const BROWN_LIGHT = '#ead2a4';
export const BROWN_DARK = '#302811';

export const GROUND_DARK = '#000';
export const GROUND_LIGHT = '#313131';

export const SOIL_LIGHT = '#6a5243';
export const SOIL_DARK = '#443c37';

export const GREEN_DARK = '#2b592a';
export const GREEN_LIGHT = '#326522';

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

export const GROUND_STYLES = [];

GROUND_STYLES[GROUND_TYPE_BASIC] = {
	fill: GRAY_DARK,
	stroke: { width: 4, color: GRAY_DARKEST},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_SOIL] = {
	fill: SOIL_LIGHT,
	stroke: { width: 4, color: SOIL_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WOOD] = {
	fill: BROWN_LIGHT,
	stroke: { width: 4, color: BROWN_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_ROCK] = {
	fill: GRAY_LIGHT,
	stroke: { width: 4, color: GRAY_MEDIUM},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_GRASS] = {
	fill: GREEN_LIGHT,
	stroke: { width: 4, color: GREEN_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_HONEY] = {
	fill: 'orange',
	stroke: { width: 4, color: 'darkOrange'},
	background: true,
};

GROUND_STYLES[GROUND_TYPE_WAX] = {
	fill: 'darkorange',
	stroke: { width: 4, color: 'brown'},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WATER] = {
	fill: 'lightblue',
	stroke: { width: 4, color: '#009'},
};

GROUND_STYLES[GROUND_TYPE_CLOUD] = {
	fill: 'rgba(255, 255, 255, 0.3)',
	stroke: { width: 0},
	background: true
};

GROUND_STYLES[GROUND_TYPE_ROCK_BACKGROUND] = {
	fill: GRAY_LIGHTEST,
	stroke: { width: 0},
	background: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_SOIL_BACKGROUND] = {
	//fill: SOIL_DARK,
	fill: '#b7a59a',
	stroke: { width: 0},
	background: true,
	renderCorners: true
};

