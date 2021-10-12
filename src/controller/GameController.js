import ControllerBase from "./ControllerBase";
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
import SpriteBuilder from "../builder/SpriteBuilder";
import LevelEditorController from "./LevelEditorController";
import LevelEditorModel from "../model/LevelEditorModel";

export default class GameController extends ControllerBase {
	constructor(model, controls) {
		super(model, model, controls);

		this.onResizeEvent = () => this.onResize();

		this.editorController = null;
	}

	activateInternal() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
		this.newGame();
	}

	reset() {
		this.loadBackground();
		this.showMainMenu();
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeEvent);
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
		const scale = 100;

		const levelBuilder = new LevelBuilder(size, scale);
		levelBuilder.ground(GROUND_PRESET_SLOPE_LEFT);
		levelBuilder.setViewBoxScale(12);
		levelBuilder.setStartToBottom(scale * 4);

		const level = levelBuilder.build();
		level.inventory = null;
		level.plant.auto = true;

		const spriteBuilder = new SpriteBuilder(level);
		spriteBuilder.addBugs();
		spriteBuilder.addNutrients();

		this.setActiveLevel(level);
	}

	showMainMenu() {
		const builder = new MenuBuilder('main');
		builder.addLine("New Game", (e) => this.newGame());
		builder.addLine("Load Level", (e) => this.showLevelSelection());
		if (this.model.level && this.model.level.inventory) {
			builder.addLine("Quit", (e) => this.reset());
			builder.addLine("Resume", (e) => this.resume());
		} else {
			builder.addLine("Reset", (e) => this.reset());
		}
		this.model.menu.set(builder.build());
		if (this.model.level && this.model.level.inventory)
			this.levelController.deactivate();
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
		const size = new Vector2(500, 375);
		const scale = 50;

		const levelBuilder = new LevelBuilder(size, scale);
		levelBuilder.setName('new-game');
		const level = levelBuilder.build();
		const spriteBuilder = new SpriteBuilder(level);
		//spriteBuilder.addBugs();
		//spriteBuilder.addNutrients();
		spriteBuilder.addBee(levelBuilder.startPosition.addY(-10));

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
		} else {
			const size = new Vector2(500, 100);
			const scale = 80;

			const levelBuilder = new LevelBuilder(size, scale);
			levelBuilder.setName(name);
			level = levelBuilder.build();
			const spriteBuilder = new SpriteBuilder(level);
			spriteBuilder.addBugs();
			spriteBuilder.addNutrients();
		}

		this.setActiveLevel(level);
	}

	activateEditor() {
		this.deactivateEditor();
		const editor = new LevelEditorModel(this.model.level.get());
		this.model.editor.set(editor);
		this.editorController = new LevelEditorController(this.game, editor, this.controls);
		this.addChild(this.editorController);
		this.editorController.activate();
	}

	deactivateEditor() {
		this.model.editor.set(null);
		if (this.editorController !== null) {
			this.removeChild(this.editorController);
			this.editorController = null;
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
