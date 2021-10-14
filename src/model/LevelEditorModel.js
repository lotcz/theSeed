import ModelBase from "./ModelBase";
import {GROUND_STYLES} from "../renderer/Palette";

export const EDITOR_MODE_SPRITES = 'Sprites';
export const EDITOR_MODE_GROUND = 'Ground';
export const EDITOR_MODE_PLANT = 'Plant';

export const EDITOR_TOOL_DELETE = '--delete--';

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
		this.selectedMode = EDITOR_MODE_SPRITES;

		this.brushSizes = [
			1,
			6,
			12,
		];
		this.brushSize = 6;

		this.groundTypes = Object.keys(GROUND_STYLES);
		this.groundTypes.unshift(EDITOR_TOOL_DELETE);
		this.selectedGroundType = this.groundTypes[0];

		this.spriteTypes = [
			EDITOR_TOOL_DELETE,
			SPRITE_TYPE_BUTTERFLY,
			SPRITE_TYPE_BUG,
			SPRITE_TYPE_WATER
		];
		this.selectedSpriteType = SPRITE_TYPE_BUTTERFLY;

	}

}
