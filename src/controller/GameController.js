import ControllerBase from "../class/ControllerBase";
import LevelController from "./LevelController";
import LevelModel from "../model/LevelModel";
import Vector2 from "../class/Vector2";
import LevelBuilder from "../builder/LevelBuilder";
import * as dat from 'dat.gui';

import {
	GROUND_PRESET_HILL,
	GROUND_PRESET_SLOPE_LEFT,
	GROUND_PRESET_SLOPE_RIGHT,
	GROUND_PRESET_VALLEY
} from "../builder/GroundBuilder";
import MenuBuilder from "../builder/MenuBuilder";
import LevelEditorController from "./LevelEditorController";

export default class GameController extends ControllerBase {
	constructor(model, controls) {
		super(model, model, controls);

		this.onResizeEvent = () => this.onResize();

		this.editorController = null;
		if (this.model.editor) {
			this.model.editor.levelLoadRequest.addOnChangeListener((sender, value) => this.onLoadLeveRequest(value));
		}
	}

	activateInternal() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
		this.newGame();
	}

	reset() {
		this.model.level.set(null);
		this.loadBackground();
		this.showMainMenu();
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeEvent);
	}

	async onLoadLeveRequest(levelName) {
		if (levelName) {
			console.log('Level request', levelName);
			this.model.editor.levelLoadRequest.set(false);
			await this.loadSaveGame(levelName);
		}
		this.model.editor.levelLoadRequest.clean();
	}

	setActiveLevel(levelModel) {
		if (this.levelController) this.removeChild(this.levelController);
		this.model.level.set(levelModel);
		this.levelController = new LevelController(this.model, this.model.level.get(), this.controls);
		this.addChild(this.levelController);
		this.levelController.activate();
		this.showPlayMenu();
		this.onResize();
		if (this.model.isInEditMode.get()) {
			this.activateEditor();
		}
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		if (!this.model.level.isEmpty())
			this.model.level.get().viewBoxSize.set(this.model.viewBoxSize);
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

		const level = levelBuilder.level;
		level.centerView();

		this.setActiveLevel(level);
	}

	showMainMenu() {
		const builder = new MenuBuilder('main');
		builder.addLine("New Game", (e) => this.newGame());
		builder.addLine("Load Level", (e) => this.showLevelSelection());
		if (!this.model.level.isEmpty()) {
			if (this.model.level.get().bee) {
				builder.addLine("Quit", (e) => this.reset());
				builder.addLine("Resume", (e) => this.resume());
			} else {
				builder.addLine("Reset", (e) => this.reset());
			}
		}
		this.model.menu.set(builder.build());

		if (!this.model.level.isEmpty()) {
			if (this.model.level.get().bee) {
				this.levelController.deactivate();
			}
		}
	}

	showLevelSelection() {
		const builder = new MenuBuilder('main');
		builder.addLine("Level 1", (e) => this.loadSaveGame('level-1'));
		builder.addLine("Level 2", (e) => this.loadSaveGame('level-2'));
		builder.addLine("Playground", (e) => this.loadSaveGame('playground'));
		builder.addLine("Back", (e) => this.showMainMenu());
		this.model.menu.set(builder.build());
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

	newGame() {
		const size = new Vector2(100, 50);
		const start = new Vector2(50, 25);
		const tileRadius = 50;
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

	async loadSaveGameAsync(name) {
		return new Promise(
			function(resolve) {
				resolve(localStorage.getItem('beehive-savegame-' + name));
			}
		);
	}

	async loadSaveGame(name) {
		this.model.level.set(null);
		this.deactivateEditor();
		this.hideMenu();

		const store = await this.loadSaveGameAsync(name);

		let level = null;
		if (store) {
			const state = JSON.parse(store);
			level = new LevelModel(state);
			console.log(`Level ${level.name} loaded.`);
			this.setActiveLevel(level);
		} else {
			console.warn(`Level ${name} not found!`);
			this.newGame();
		}

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
}
