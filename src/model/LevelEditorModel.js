import ModelBase from "./ModelBase";
import {GROUND_STYLES} from "../renderer/Palette";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import CollectionModel from "./CollectionModel";
import VectorCollectionModel from "./VectorCollectionModel";

export const EDITOR_MODE_SPRITES = 'Sprites';
export const EDITOR_MODE_GROUND = 'Ground';
export const EDITOR_MODE_PLANT = 'Plant';

export const EDITOR_TOOL_DELETE = '--delete--';
export const EDITOR_TOOL_SELECT = '--select--';

export const SPRITE_TYPE_BUG = 'bug';
export const SPRITE_TYPE_BUTTERFLY = 'butterfly';
export const SPRITE_TYPE_WATER = 'water';
export const SPRITE_TYPE_RESPAWN = 'respawn';

export default class LevelEditorModel extends ModelBase {
	modes;
	selectedMode;
	showGroundTiles;
	brushSizes;
	brushSize;
	groundTypes;
	selectedGroundType;
	spriteTypes;
	selectedSpriteType;
	showSpriteHelpers;
	highlightedTilePosition;
	highlights;
	levelLoadRequest;

	constructor() {
		super();

		this.modes = [
			EDITOR_MODE_GROUND,
			EDITOR_MODE_SPRITES,
			EDITOR_MODE_PLANT
		];
		this.selectedMode = new DirtyValue(EDITOR_MODE_SPRITES);
		this.addChild(this.selectedMode);
		this.showGroundTiles = new DirtyValue(false);
		this.addChild(this.showGroundTiles);
		this.showSpriteHelpers = new DirtyValue(false);
		this.addChild(this.showSpriteHelpers);
		this.levelLoadRequest = new DirtyValue(false);
		this.addChild(this.levelLoadRequest);

		this.brushSizes = [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13
		];
		this.brushSize = 2;

		this.groundTypes = Object.keys(GROUND_STYLES);
		this.groundTypes.unshift(EDITOR_TOOL_DELETE);
		this.selectedGroundType = this.groundTypes[0];

		this.spriteTypes = [
			EDITOR_TOOL_SELECT,
			EDITOR_TOOL_DELETE,
			SPRITE_TYPE_BUTTERFLY,
			SPRITE_TYPE_BUG,
			SPRITE_TYPE_WATER,
			SPRITE_TYPE_RESPAWN
		];
		this.selectedSpriteType = this.spriteTypes[0];

		this.highlightedTilePosition = new Vector2();
		this.addChild(this.highlightedTilePosition);
		this.highlights = new VectorCollectionModel();
		this.addChild(this.highlights);

	}

}
