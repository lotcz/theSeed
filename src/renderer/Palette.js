export const SKY_LIGHT = '#a3d2fe';
export const SKY_DARK = '#6483bc';

export const BROWN_LIGHT = '#ead2a4';
export const BROWN_DARK = '#302811';

export const GROUND_DARK = '#000';
export const GROUND_LIGHT = '#313131';

export const GREEN_DARK = '#2b592a';
export const GREEN_LIGHT = '#326522';

export const GROUND_TYPE_BASIC = 'basic';
export const GROUND_TYPE_WOOD = 'wood';
export const GROUND_TYPE_ROCK = 'rock';
export const GROUND_TYPE_GRASS = 'grass';
export const GROUND_TYPE_HONEY = 'honey';
export const GROUND_TYPE_WAX = 'wax';
export const GROUND_TYPE_WATER = 'water';
export const GROUND_TYPE_ROCK_BACKGROUND = 'background-rock';

export const GROUND_STYLES = [];

GROUND_STYLES[GROUND_TYPE_BASIC] = {
	fill: GROUND_LIGHT,
	stroke: { width: 4, color: GROUND_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_WOOD] = {
	fill: BROWN_LIGHT,
	stroke: { width: 4, color: BROWN_DARK},
	renderCorners: true
};

GROUND_STYLES[GROUND_TYPE_ROCK] = {
	fill: '#909090',
	stroke: { width: 4, color: '#202020'},
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
	fill: 'darkblue',
	stroke: { width: 4, color: '#009'},
	background: true
};

GROUND_STYLES[GROUND_TYPE_ROCK_BACKGROUND] = {
	fill: 'darkgray',
	stroke: { width: 0, color: '#009'},
	background: true,
	renderCorners: true
};
