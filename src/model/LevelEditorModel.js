import ModelBase from "./ModelBase";
import {GROUND_STYLES, SPRITE_STYLES} from "../renderer/Palette";
import Vector2 from "../class/Vector2";
import DirtyValue from "../class/DirtyValue";
import CollectionModel from "./CollectionModel";
import VectorCollectionModel from "./VectorCollectionModel";
import {
	STRATEGY_BUG,
	STRATEGY_BUTTERFLY,
	STRATEGY_EXIT,
	STRATEGY_MINERAL,
	STRATEGY_RESPAWN,
	STRATEGY_WATER,
	STRATEGY_WORM
} from "../controller/SpriteController";

export const EDITOR_MODE_SPRITES = 'Sprites';
export const EDITOR_MODE_GROUND = 'Ground';
export const EDITOR_MODE_PLANT = 'Plant';

export const EDITOR_TOOL_DELETE = '--delete--';
export const EDITOR_TOOL_SELECT = '--select--';

export const SPRITE_STRATEGIES = [STRATEGY_BUG, STRATEGY_WATER, STRATEGY_MINERAL, STRATEGY_BUTTERFLY, STRATEGY_RESPAWN, STRATEGY_EXIT, STRATEGY_WORM];

export default class LevelEditorModel extends ModelBase {
	modes;
	selectedMode;
	showGroundTiles;
	brushSize;
	groundTypes;
	selectedGroundType;
	spriteTypes;
	selectedSpriteType;
	showSpriteHelpers;
	highlightedTilePosition;
	highlights;
	levelLoadRequest;
	selectedSprites;

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

		this.brushSize = 2;

		this.groundTypes = Object.keys(GROUND_STYLES);
		this.groundTypes.unshift(EDITOR_TOOL_DELETE);
		this.selectedGroundType = this.groundTypes[0];

		this.spriteTypes = Object.keys(SPRITE_STYLES);
		this.spriteTypes.unshift(EDITOR_TOOL_SELECT);
		this.spriteTypes.unshift(EDITOR_TOOL_DELETE);

		this.selectedSpriteType = this.spriteTypes[0];

		this.selectedSprites = new CollectionModel();
		this.addChild(this.selectedSprites);

		this.highlightedTilePosition = new Vector2();
		this.addChild(this.highlightedTilePosition);
		this.highlights = new VectorCollectionModel();
		this.addChild(this.highlights);

	}

}
