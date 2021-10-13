import ModelBase from "./ModelBase";
import {
	GROUND_TYPE_BASIC,
	GROUND_TYPE_DELETE,
	GROUND_TYPE_GRASS, GROUND_TYPE_WOOD,
	GROUND_TYPE_HONEY,
	GROUND_TYPE_ROCK, GROUND_TYPE_WAX, GROUND_TYPE_WATER, GROUND_TYPE_ROCK_BACKGROUND
} from "./GroundTileModel";

export const EDITOR_MODE_SPRITES = 'Sprites';
export const EDITOR_MODE_GROUND = 'Ground';
export const EDITOR_MODE_PLANT = 'Plant';

export const SPRITE_TYPE_DELETE = '---delete--';
export const SPRITE_TYPE_BUG = 'bug';
export const SPRITE_TYPE_BUTTERFLY = 'butterfly';
export const SPRITE_TYPE_WATER = 'water';

export default class LevelEditorModel extends ModelBase {
	modes;
	selectedMode;
	brushSizes;
	brushSize;
	groundTypes;
	selectedGroundType;
	spriteTypes;
	selectedSpriteType;

	constructor() {
		super();

		this.modes = [
			EDITOR_MODE_GROUND,
			EDITOR_MODE_SPRITES,
			EDITOR_MODE_PLANT
		];
		this.selectedMode = EDITOR_MODE_GROUND;

		this.brushSizes = [
			1,
			6,
			12,
		];
		this.brushSize = 6;

		this.groundTypes = [
			GROUND_TYPE_DELETE,
			GROUND_TYPE_BASIC,
			GROUND_TYPE_WOOD,
			GROUND_TYPE_ROCK,
			GROUND_TYPE_GRASS,
			GROUND_TYPE_HONEY,
			GROUND_TYPE_WAX,
			GROUND_TYPE_WATER,
			GROUND_TYPE_ROCK_BACKGROUND
		];
		this.selectedGroundType = GROUND_TYPE_BASIC;

		this.spriteTypes = [
			SPRITE_TYPE_DELETE,
			SPRITE_TYPE_BUTTERFLY,
			SPRITE_TYPE_BUG,
			SPRITE_TYPE_WATER
		];
		this.selectedSpriteType = SPRITE_TYPE_BUTTERFLY;

	}

}
