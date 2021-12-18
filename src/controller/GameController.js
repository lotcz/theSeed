import ControllerBase from "../class/ControllerBase";
import LevelController from "./LevelController";
import LevelModel from "../model/LevelModel";
import Vector2 from "../class/Vector2";
import * as localForage from "localforage";
import MenuBuilder from "../builder/MenuBuilder";
import LevelEditorController from "./LevelEditorController";
import {EDIT_MODE_ENABLED, START_LEVEL} from "../model/GameModel";
import {EDITOR_LEVEL_NAME_PREFIX} from "../renderer/LevelEditorRenderer";
import ControlsController from "./ControlsController";
import {MAX_HEALTH} from "../model/BeeStateModel";

const DEBUG_GAME_CONTROLLER = true;
const SAVE_GAME_NAME = 'beehive-save-game';
const SAVE_LEVEL_NAME_PREFIX = 'beehive-save-game';

export default class GameController extends ControllerBase {
	levels;

	constructor(model, dom) {
		super(model, model);

		this.onResizeEvent = () => this.onResize();

		this.editorController = null;
		if (this.model.editor) {
			this.model.editor.levelLoadRequest.addOnChangeListener(async (value) => await this.onEditorLoadLevelRequestAsync(value));
		}

		this.controlsController = new ControlsController(this.game, this.model.controls, dom);
		this.addChild(this.controlsController);

		this.model.controls.editModeRequested.addOnChangeListener(() => this.onEditModeRequested());
		this.model.controls.menuRequested.addOnChangeListener(() => this.onMenuRequested());

		this.model.levelName.addOnChangeListener(async (value) => await this.onLoadLevelRequestAsync(value));

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

	onMenuRequested() {
		if (this.controls.menuRequested.get()) {
			const isMenuOpen = this.model.menu.isSet() && this.model.menu.get().css === 'main';
			if (!isMenuOpen) {
				this.showMainMenu();
			} else if (this.model.level.isSet() && this.model.level.get().isPlayable) {
				this.resume();
			}
			this.controls.menuRequested.set(false);
		}
	}

	onEditModeRequested() {
		if (!EDIT_MODE_ENABLED) return;

		if (this.controls.editModeRequested.get()) {
			if (!this.model.isInEditMode.get()) {
				this.model.isInEditMode.set(true);
				this.activateEditor();
			} else {
				this.model.isInEditMode.set(false);
				this.deactivateEditor();
			}
			this.controls.editModeRequested.set(false);
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
				if (this.model.beeState.isAlive()) {
					await this.loadLevelAsync(levelName, this.model.lastLevelName, bee);
				} else {
					this.model.beeState.health.set(MAX_HEALTH);
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
				state = this.model.levels.get(levelName);
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

	getSavedLevelName(gameId, levelName) {
		return `${SAVE_LEVEL_NAME_PREFIX}-${levelName}-${gameId}`;
	}

	getEditorLevelName(levelName) {
		return `${EDITOR_LEVEL_NAME_PREFIX}-${levelName}`;
	}

	setActiveLevel(level) {
		if (this.levelController) this.removeChild(this.levelController);
		this.model.isFullscreen.set(level.isPlayable);
		this.model.level.set(level);
		this.levelController = new LevelController(this.model, level, this.controls);
		this.addChild(this.levelController);
		this.levelController.activate();
		this.showPlayMenu();
		this.onResize();
		if (this.model.isInEditMode.get()) {
			this.activateEditor();
		}
		if (level.isPlayable) {
			this.saveGame();
		}
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
			state = this.model.levels.get(name);
			if (state) console.log(`Level ${name} loaded from initial state.`);
		}

		if (!state) {
			console.error(`Level ${name} not found!`);
			return;
		}

		const level = new LevelModel(state);
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
		this.savedGameExists = true;
		this.saveLevelToStorageAsync().then(() => {
		const state = this.game.getState();
		localForage.setItem(SAVE_GAME_NAME, state)
			.then(() => console.log('Game saved.'));
		});
	}

	showMainMenu() {
		const level = this.model.level.get();
		const builder = new MenuBuilder('main');
		if (level && level.isPlayable) {
			builder.addLine("Continue", (e) => this.resume());
		} else if (this.savedGameExists) {
			builder.addLine("Continue", (e) => this.loadGameAsync());
		}

		if (this.savedGameExists) {
			builder.addLine("Start New Adventure", (e) => this.newGameConfirm());
		} else {
			builder.addLine("Start New Adventure", (e) => this.newGame());
		}

		if (EDIT_MODE_ENABLED) {
			builder.addLine("Editor", (e) => this.showEditorMenu());
		}
		this.model.menu.set(builder.build());

		if (level && level.isPlayable) {
			this.levelController.deactivate();
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
		const levelNames = this.model.levels.keys();
		levelNames.forEach((name) => {
			builder.addLine(name, (e) => this.onEditorLoadLevelRequestAsync(name));
		});
		builder.addLine("Back", (e) => this.showEditorMenu());
		this.model.menu.set(builder.build());
	}

	loadBackground() {
		const level = new LevelModel(this.model.levels.get('intro'));
		level.removeBee();
		level.isPlayable = false;
		this.setActiveLevel(level);
	}

	newGameConfirm() {
		const builder = new MenuBuilder('main');
		builder.addLine("Yes", (e) => this.newGame());
		builder.addLine("No", (e) => this.showMainMenu());
		this.model.menu.set(builder.build());
	}

	newGame() {
		localForage.clear().then(() => {
			this.model.history.reset();
			this.model.id = Date.now();
			this.model.beeState.lives.set(0);
			this.model.beeState.maxLives.set(0);
			this.model.beeState.health.set(MAX_HEALTH);
			this.model.lastLevelName = null;
			this.model.levelName.set(null);
			this.model.levelName.set(START_LEVEL);
		});
	}

	newLevel() {
		const size = new Vector2(100, 50);
		const start = new Vector2(50, 25);
		const tileRadius = 75;
		const scale = 3;

		const level = new LevelModel();
		level.setName('new-level');
		level.setSize(size);
		level.setTileRadius(tileRadius);
		level.setViewBoxSize(this.model.viewBoxSize);
		level.setViewBoxScale(scale);
		level.setStart(start);
		level.createBeeOnPosition(start);

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
		this.editorController = new LevelEditorController(this.game, this.model.editor);
		this.addChild(this.editorController);
		this.editorController.activate();
	}

	deactivateEditor() {
		if (this.editorController !== null) {
			this.removeChild(this.editorController);
		}
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		if (this.model.level.isSet()) {
			const level = this.model.level.get();
			const isMobile = this.model.viewBoxSize.x < 650;
			const isPlayable = (level.isPlayable && level.bee);
			const isFullscreen = this.model.isFullscreen.get();
			if (isFullscreen) {
				level.viewBoxSize.set(this.model.viewBoxSize);
				const scale = isMobile ? 4 : 3;
				level.viewBoxScale.set(scale);
				if (isPlayable) {
					level.centerOnCoordinates(level.bee.coordinates);
				}
			} else {
				const width = this.model.viewBoxSize.x * 0.5;
				level.viewBoxSize.set(width, width * 0.625);
				const scale = isMobile ? 12 : 9;
				level.viewBoxScale.set(scale);
				level.centerOnLevel();
			}
			level.sanitizeViewBox();
		}
	}

}
