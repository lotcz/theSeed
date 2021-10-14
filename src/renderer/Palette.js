export const BLUE_DARKEST = '#2a364f';
export const BLUE_DARK = '#415781';
export const BLUE_MEDIUM = '#6483bc';
export const BLUE_LIGHT = '#84a7e7';
export const BLUE_LIGHTEST = '#a3d2fe';

export const GRAY_DARKEST = '#101010';
export const GRAY_DARK = '#313131';
export const GRAY_MEDIUM = '#606060';
export const GRAY_LIGHT = '#909090';
export const GRAY_LIGHTEST = '#e0e0f0';

export const BROWN_DARKEST = '#202010';
export const BROWN_DARK = '#302811';
export const BROWN_MEDIUM = '#443c37';
export const BROWN_LIGHT = '#6a5243';
export const BROWN_LIGHTEST = '#eac2a4';

export const GREEN_DARK = '#0b490a';
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
	fill: BLUE_DARKEST,
	stroke: { width: 150, color: BLUE_DARKEST},
	background: true
};

GROUND_STYLES[GROUND_TYPE_CLOUD] = {
	fill: 'rgba(255, 255, 255, 0.3)',
	stroke: { width: 0},
	background: true
};

GROUND_STYLES[GROUND_TYPE_ROCK_BACKGROUND] = {
	fill: GRAY_LIGHT,
	stroke: { width: 0},
	background: true,
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_SOIL_BACKGROUND] = {
	//fill: SOIL_DARK,
	fill: BROWN_LIGHT,
	stroke: { width: 20, color: BROWN_LIGHT},
	background: true,
	renderCorners: true
};

