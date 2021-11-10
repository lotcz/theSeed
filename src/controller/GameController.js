import ControllerBase from "../class/ControllerBase";
import LevelController from "./LevelController";
import LevelModel from "../model/LevelModel";
import Vector2 from "../class/Vector2";
import LevelBuilder from "../builder/LevelBuilder";
import * as localForage from "localforage";
import LevelIntro from "../../levels/intro.json";
import LevelBeehive from "../../levels/beehive.json";
import LevelLevel1 from "../../levels/level-1.json";
import LevelLevel2 from "../../levels/level-2.json";

import {
	GROUND_PRESET_HILL,
	GROUND_PRESET_SLOPE_LEFT,
	GROUND_PRESET_SLOPE_RIGHT,
	GROUND_PRESET_VALLEY
} from "../builder/GroundBuilder";
import MenuBuilder from "../builder/MenuBuilder";
import LevelEditorController from "./LevelEditorController";
import {STRATEGY_STATIC} from "../builder/SpriteStyle";
import HashTableModel from "../model/HashTableModel";
import {DEBUG_MODE} from "../model/GameModel";
import {EDITOR_LEVEL_NAME_PREFIX} from "../renderer/LevelEditorRenderer";

const DEBUG_GAME_CONTROLLER = true;
const SAVE_GAME_NAME = 'beehive-save-game';
const SAVE_LEVEL_NAME_PREFIX = 'beehive-save-game';

export default class GameController extends ControllerBase {
	levels;

	constructor(model, controls) {
		super(model, model, controls);

		this.onResizeEvent = () => this.onResize();

		this.editorController = null;
		if (this.model.editor) {
			this.model.editor.levelLoadRequest.addOnChangeListener(async (value) => await this.onEditorLoadLevelRequestAsync(value));
		}

		this.model.levelName.addOnChangeListener(async (value) => await this.onLoadLevelRequestAsync(value));

		this.levels = new HashTableModel();
		this.levels.set('intro', LevelIntro);
		this.levels.set('beehive', LevelBeehive);
		this.levels.set('level-1', LevelLevel1);
		this.levels.set('level-2', LevelLevel2);

		this.savedGameExists = false;
	}

	reset() {
		this.model.level.set(null);
		this.loadBackground();
		this.showMainMenu();
	}

	activateInternal() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
		localForage.getItem(SAVE_GAME_NAME).then((saveGame) => {
			this.savedGameExists = (saveGame !== null);
			this.reset();
		});
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeEvent);
	}

	updateInternal() {
		if (this.controls.menuRequested.isDirty()) {
			if (this.controls.menuRequested.get()) {
				if (!this.model.isInEditMode.get()) {
					this.model.isInEditMode.set(true);
					this.activateEditor();
				} else {
					this.model.isInEditMode.set(false);
					this.deactivateEditor();
				}
			}
			this.controls.menuRequested.set(false);
			this.controls.menuRequested.clean();
		}
	}

	async onLoadLevelRequestAsync(levelName) {
		if (levelName) {
			if (DEBUG_GAME_CONTROLLER) console.log('Level requested: ', levelName);
			let bee = null;
			if (!this.model.level.isEmpty()) {
				const level = this.model.level.get();
				if (level.isPlayable) {
					this.saveGame();
					this.model.lastLevelName = level.name;
					bee = level.bee;
				}
			}
			if (bee) {
				if (bee.health.get() > 0) {
					await this.loadLevelAsync(levelName, this.model.lastLevelName, bee);
				} else {
					await this.loadLevelAsync(levelName, 'start');
				}
			} else {
				await this.loadLevelAsync(levelName, this.model.lastLevelName);
			}
		} else {
			this.model.level.set(null);
			if (DEBUG_GAME_CONTROLLER) console.log('Level was reset.');
		}
	}

	async onEditorLoadLevelRequestAsync(levelName) {
		this.model.editor.levelLoadRequest.clean();
		if (levelName) {
			if (DEBUG_GAME_CONTROLLER) console.log('Editor level request: ', levelName);
			this.model.editor.levelLoadRequest.set(false);
			this.model.level.set(null);
			this.deactivateEditor();
			this.hideMenu();

			let state = null;
			const store = await this.loadLevelFromStorageAsync(this.getEditorLevelName(levelName));

			if (store) {
				state = store;
				console.log(`Editor level ${levelName} loaded from local storage.`);
			} else {
				state = this.levels.get(levelName);
				if (state) console.log(`Editor level ${levelName} loaded from initial state.`);
			}

			if (!state) {
				console.error(`Level ${levelName} not found!`);
				return;
			}

			let level = new LevelModel(state);
			this.setActiveLevel(level);
		}

	}

	setActiveLevel(level) {
		if (this.levelController) this.removeChild(this.levelController);
		this.model.level.set(level);
		this.levelController = new LevelController(this.model, level, this.controls);
		this.addChild(this.levelController);
		this.levelController.activate();
		this.showPlayMenu();
		this.onResize();
		if (level.isPlayable && level.bee) {
			level.centerOnCoordinates(level.bee.coordinates);
		}
		level.sanitizeViewBox();
		if (this.model.isInEditMode.get()) {
			this.activateEditor();
		}
		if (level.isPlayable) {
			this.saveGame();
		}
	}

	getSavedLevelName(gameId, levelName) {
		return `${SAVE_LEVEL_NAME_PREFIX}-${levelName}-${gameId}`;
	}

	getEditorLevelName(levelName) {
		return `${EDITOR_LEVEL_NAME_PREFIX}-${levelName}`;
	}

	async loadLevelFromStorageAsync(name) {
		return localForage.getItem(name);
	}

	async saveLevelToStorageAsync() {
		if (this.game.level.isEmpty()) {
			if (DEBUG_GAME_CONTROLLER) console.log('No level to save.');
			return;
		}
		const level = this.game.level.get();
		const id = this.model.id;
		const state = level.getState();
		await localForage.setItem(this.getSavedLevelName(id, level.name), state)
		if (DEBUG_GAME_CONTROLLER) console.log('Level saved.');
	}

	async loadLevelAsync(name, spawn = null, bee = null) {
		if (this.levelController) this.levelController.deactivate();
		this.model.level.set(null);
		this.deactivateEditor();
		this.hideMenu();

		let state = null;

		const store = await this.loadLevelFromStorageAsync(this.getSavedLevelName(this.model.id, name));

		if (store) {
			state = store;
			console.log(`Level ${name} loaded from local storage.`);
		} else {
			state = this.levels.get(name);
			if (state) console.log(`Level ${name} loaded from initial state.`);
		}

		if (!state) {
			console.error(`Level ${name} not found!`);
			return;
		}

		let level = new LevelModel(state);
		if (spawn === null) {
			spawn = 'start';
		}
		level.spawn(bee, spawn);
		this.setActiveLevel(level);
	}

	async loadGameAsync() {
		const store = await localForage.getItem(SAVE_GAME_NAME);
		if (store) {
			console.log('Game loaded');
			const state = store;
			this.model.restoreState(state);
			return true;
		} else {
			console.log('No saved game found.');
			return false;
		}
	}

	saveGame() {
		this.saveLevelToStorageAsync().then(() => {
			const state = this.game.getState();
			localForage.setItem(SAVE_GAME_NAME, state)
				.then(() => console.log('Game saved.'));
		});
	}

	showMainMenu() {
		const builder = new MenuBuilder('main');
		if (this.model.level.get().isPlayable) {
			builder.addLine("Continue", (e) => this.resume());
		} else if (this.savedGameExists) {
			builder.addLine("Continue", (e) => this.loadGameAsync());
		}
		builder.addLine("New Game", (e) => this.newGame());
		if (DEBUG_MODE) {
			builder.addLine("Editor", (e) => this.showEditorMenu());
		}
		this.model.menu.set(builder.build());

		if (!this.model.level.isEmpty()) {
			if (this.model.level.get().isPlayable) {
				this.levelController.deactivate();
			}
		}

	}

	showEditorMenu() {
		const builder = new MenuBuilder('main');
		builder.addLine("New Level", (e) => this.newLevel());
		builder.addLine("Load Level", (e) => this.showLevelSelection());
		builder.addLine("Reset", (e) => this.reset());
		builder.addLine("Back", (e) => this.showMainMenu());
		this.model.menu.set(builder.build());
	}

	showLevelSelection() {
		const builder = new MenuBuilder('main');
		const levelNames = this.levels.keys();
		levelNames.forEach((name) => {
			builder.addLine(name, (e) => this.onEditorLoadLevelRequestAsync(name));
		});
		builder.addLine("Back", (e) => this.showEditorMenu());
		this.model.menu.set(builder.build());
	}

	loadBackground() {
		const level = new LevelModel(this.levels.get('intro'));
		level.removeBee();
		level.isPlayable = false;
		level.centerView();
		this.setActiveLevel(level);
	}

	newGame() {
		localForage.clear().then(() => {
			this.model.id = Date.now();
			this.model.lastLevelName = null;
			this.model.levelName.set(null);
			this.model.levelName.set('beehive');
		});
	}

	newLevel() {
		const size = new Vector2(100, 50);
		const start = new Vector2(50, 25);
		const tileRadius = 75;
		const scale = 3;

		const levelBuilder = new LevelBuilder();
		levelBuilder.setName('new-game');
		levelBuilder.setSize(size);
		levelBuilder.setTileRadius(tileRadius);
		levelBuilder.setViewBoxSize(this.model.viewBoxSize);
		levelBuilder.setViewBoxScale(scale);
		levelBuilder.setStart(start);
		levelBuilder.addBee(start);
		const level = levelBuilder.build();

		this.hideMenu();
		this.setActiveLevel(level);
	}

	hideMenu() {
		this.model.menu.set(null);
	}

	showPlayMenu() {
		const builder = new MenuBuilder('play');
		builder.addLine("menu", (e) => this.showMainMenu());
		this.model.menu.set(builder.build());
	}

	resume() {
		this.showPlayMenu();
		this.levelController.activate();
	}

	activateEditor() {
		this.deactivateEditor();
		this.editorController = new LevelEditorController(this.game, this.model.editor, this.controls);
		this.addChild(this.editorController);
		this.editorController.activate();
	}

	deactivateEditor() {
		//this.model.editor.set(null);
		if (this.editorController !== null) {
			this.removeChild(this.editorController);
			//this.editorController = null;
		}
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		if (!this.model.level.isEmpty()) {
			const level = this.model.level.get();
			level.viewBoxSize.set(this.model.viewBoxSize);
			if (level.isPlayable && level.bee) {
				const isMobile = this.model.viewBoxSize.x < 650;
				const scale = isMobile ? 6.5 : 4;
				level.viewBoxScale.set(scale);
				level.centerOnCoordinates(level.bee.coordinates);
			}
			level.sanitizeViewBox();
		}
	}

}
