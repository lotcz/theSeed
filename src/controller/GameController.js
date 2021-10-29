import ControllerBase from "../class/ControllerBase";
import LevelController from "./LevelController";
import LevelModel from "../model/LevelModel";
import Vector2 from "../class/Vector2";
import LevelBuilder from "../builder/LevelBuilder";
import LevelBeehive from "../../levels/beehive.json";
import LevelLevel1 from "../../levels/level-1.json";
import {
	GROUND_PRESET_HILL,
	GROUND_PRESET_SLOPE_LEFT,
	GROUND_PRESET_SLOPE_RIGHT,
	GROUND_PRESET_VALLEY
} from "../builder/GroundBuilder";
import MenuBuilder from "../builder/MenuBuilder";
import LevelEditorController from "./LevelEditorController";
import {STRATEGY_RESPAWN} from "../builder/SpriteStyle";
import HashTableModel from "../model/HashTableModel";
import {DEBUG_MODE} from "../model/GameModel";

export default class GameController extends ControllerBase {
	levels;

	constructor(model, controls) {
		super(model, model, controls);

		this.onResizeEvent = () => this.onResize();

		this.editorController = null;
		if (this.model.editor) {
			this.model.editor.levelLoadRequest.addOnChangeListener((value) => this.onEditorLoadLevelRequest(value));
		}

		this.model.levelName.addOnChangeListener((value) => this.onLoadLevelRequest(value));

		this.levels = new HashTableModel();
		this.levels.set('beehive', LevelBeehive);
		this.levels.set('level-1', LevelLevel1);
	}

	reset() {
		this.model.level.set(null);
		this.loadBackground();
		this.showMainMenu();
	}

	activateInternal() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
		this.loadGame();
		if (this.model.level.isEmpty()) {
			this.reset();
		}
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

	async onLoadLevelRequest(levelName) {
		if (levelName) {
			console.log('Level request', levelName);
			let bee = null;
			if (!this.model.level.isEmpty()) {
				this.model.lastLevelName = this.model.level.get().name;
				bee = this.model.level.get().bee;
			}
			if (bee) {
				if (bee.health.get() > 0) {
					await this.loadLevel(levelName, this.model.lastLevelName, bee);
				} else {
					await this.loadLevel(levelName, 'start');
				}
			} else {
				await this.loadLevel(levelName, this.model.lastLevelName);
			}
		} else {
			this.model.level.set(null);
			console.log('Level reset.');
		}
	}

	async onEditorLoadLevelRequest(levelName) {
		if (levelName) {
			console.log('Editor Level request', levelName);
			this.model.editor.levelLoadRequest.set(false);
			await this.loadLevel(levelName);
		}
		this.model.editor.levelLoadRequest.clean();
	}

	setActiveLevel(level) {
		if (this.levelController) this.removeChild(this.levelController);
		this.model.level.set(level);
		this.levelController = new LevelController(this.model, this.model.level.get(), this.controls);
		this.addChild(this.levelController);
		this.levelController.activate();
		this.showPlayMenu();
		this.onResize();
		level.sanitizeViewBox();
		if (this.model.isInEditMode.get()) {
			this.activateEditor();
		}
	}

	async loadLevelFromStorage(name) {
		const id = this.model.id;
		return new Promise(
			function(resolve) {
				resolve(localStorage.getItem(`beehive-savegame-${name}-${id}`));
			}
		);
	}

	saveLevelToStorage() {
		if (this.game.level.isEmpty()) {
			console.log('No level to save.');
			return;
		}
		const level = this.game.level.get();
		const id = this.model.id;
		const state = level.getState();
		localStorage.setItem(`beehive-savegame-${level.name}-${id}`, JSON.stringify(state));
		console.log('Level saved.');
	}

	async loadLevel(name, spawn = null, bee = null) {
		if (this.levelController) this.levelController.deactivate();
		this.model.level.set(null);
		this.deactivateEditor();
		this.hideMenu();

		let state = null;

		const store = await this.loadLevelFromStorage(name);

		if (store) {
			state = JSON.parse(store);
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
		if (spawn) {
			level.spawn(bee, spawn);
		}
		this.setActiveLevel(level);
		this.saveGame();
	}

	loadGame() {
		const store = localStorage.getItem('beehive-savegame');
		if (store) {
			const state = JSON.parse(store);
			this.model.restoreState(state);
			console.log('Game loaded');
			return true;
		} else {
			console.log('No saved game found.');
			return false;
		}
	}

	saveGame() {
		const state = this.game.getState();
		const str = JSON.stringify(state);
		localStorage.setItem('beehive-savegame', str);
		this.saveLevelToStorage();
		console.log('Game saved.');
	}

	showMainMenu() {
		const builder = new MenuBuilder('main');
		if (this.model.level.get().isPlayable) {
			builder.addLine("Continue", (e) => this.resume());
		}
		builder.addLine("Start a New Game", (e) => this.newGame());
		if (DEBUG_MODE) {
			builder.addLine("Editor", (e) => this.showEditorMenu());
		}
		this.model.menu.set(builder.build());

		if (!this.model.level.isEmpty()) {
			if (this.model.level.get().bee) {
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

		if (!this.model.level.isEmpty()) {
			if (this.model.level.get().bee) {
				this.levelController.deactivate();
			}
		}
	}

	showLevelSelection() {
		const builder = new MenuBuilder('main');
		builder.addLine("Beehive", (e) => this.loadLevel('beehive'));
		builder.addLine("Level 1", (e) => this.loadLevel('level-1'));
		builder.addLine("Level 2", (e) => this.loadLevel('level-2'));
		builder.addLine("Back", (e) => this.showEditorMenu());
		this.model.menu.set(builder.build());
	}

	loadBackground() {
		const size = new Vector2(200, 150);
		const tileSize = 100;
		const scale = 12;

		const levelBuilder = new LevelBuilder();
		levelBuilder.setSize(size);
		levelBuilder.setTileRadius(tileSize);
		levelBuilder.generateGround(GROUND_PRESET_SLOPE_LEFT);
		levelBuilder.setViewBoxScale(scale);
		levelBuilder.setViewBoxSize(this.model.viewBoxSize);

		const level = levelBuilder.build();
		level.isPlayable = false;
		level.centerView();
		this.setActiveLevel(level);
	}

	newGame() {
		this.model.id = Date.now();
		this.model.lastLevelName = null;
		this.model.levelName.set(null);
		this.model.levelName.set('beehive');
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
		if (!this.model.level.isEmpty())
			this.model.level.get().viewBoxSize.set(this.model.viewBoxSize);
	}

}
