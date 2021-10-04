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

export default class GameController extends ControllerBase {
	constructor(model, controls) {
		super(model, model, controls);

		this.onResizeEvent = () => this.onResize();
		this.gui = null;
	}

	activateInternal() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
		this.reset();
	}

	reset() {
		this.loadBackground();
		this.showMainMenu();
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeEvent);
		if (this.gui) this.gui.destroy();
	}

	loadLevel(levelModel) {
		this.model.loading.set(true);
		if (this.levelController) this.removeChild(this.levelController);
		this.model.setLevel(levelModel);
		this.levelController = new LevelController(this.model, this.model.level, this.controls);
		this.addChild(this.levelController);
		this.levelController.activate();
		this.levelController.updateCameraOffset();
		this.showPlayMenu();
		this.onResize();

		if (this.gui) this.gui.destroy();
		this.gui = new dat.GUI();
		this.gui.add(this.model.level, 'name').listen();
		const gridFolder = this.gui.addFolder('grid')
		gridFolder.add(this.model.level.grid, 'scale').listen();
		const gridsizeFolder = gridFolder.addFolder('size')
		gridsizeFolder.add(this.model.level.grid.size, 'x').listen();
		gridsizeFolder.add(this.model.level.grid.size, 'y').listen();
		const scaleFolder = this.gui.addFolder('viewBoxScale')
		scaleFolder.add(this.model.level.viewBoxScale, 'value', 0, 10).listen();
		const sizeFolder = this.gui.addFolder('viewBoxSize')
		sizeFolder.add(this.model.level.viewBoxSize, 'x').listen();
		sizeFolder.add(this.model.level.viewBoxSize, 'y').listen();
		const positionFolder = this.gui.addFolder('viewBoxCoordinates')
		positionFolder.add(this.model.level.viewBoxCoordinates, 'x').listen();
		positionFolder.add(this.model.level.viewBoxCoordinates, 'y').listen();

		const _this = this;

		var actions = {
			save: function() {
				const state = _this.game.level.getState();
				console.log(state);
				localStorage.setItem('beehive-savegame-' + state.name, JSON.stringify(state));
			},
			load: function() {
				_this.model.loading.set(true);
				const name = _this.model.level.name;
				const store = localStorage.getItem('beehive-savegame-' + name);
				console.log(store);
				const state = JSON.parse(store);
				console.log(state);
				const level = new LevelModel(state);
				_this.loadLevel(level);
			}
		};

		this.gui.add(actions,'load').name('Load');
		this.gui.add(actions,'save').name('Save');

		this.gui.open();
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		if (this.model.level)
			this.model.level.viewBoxSize.set(this.model.viewBoxSize);
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

		this.loadLevel(level);
	}

	showMainMenu() {
		const builder = new MenuBuilder();
		builder.setStartPosition(this.model.viewBoxSize.multiply(0.2));
		builder.setCss('main');
		builder.addLine("New Game", (e) => this.loadSavegame('level-1'));
		builder.addLine("Load Level", (e) => this.showLevelSelection());
		if (this.model.level && this.model.level.inventory) {
			builder.addLine("Quit", (e) => this.reset());
			builder.addLine("Resume", (e) => this.resume());
		} else {
			builder.addLine("Reset", (e) => this.reset());
		}
		builder.setSize(this.model.viewBoxSize);
		const menu = builder.build();
		this.model.setMenu(menu);
		if (this.model.level && this.model.level.inventory)
			this.levelController.deactivate();
	}

	showLevelSelection() {
		const builder = new MenuBuilder();
		builder.setStartPosition(this.model.viewBoxSize.multiply(0.2));
		builder.setCss('main');
		builder.addLine("Level 1", (e) => this.loadSavegame('level-1'));
		builder.addLine("Level 2", (e) => this.loadSavegame('level-2'));
		builder.addLine("Playground", (e) => this.loadSavegame('playground'));
		builder.addLine("Back", (e) => this.showMainMenu());
		builder.setSize(this.model.viewBoxSize);
		const menu = builder.build();
		this.model.setMenu(menu);
	}

	hideMenu() {
		this.model.setMenu(null);
	}

	showPlayMenu() {
		const builder = new MenuBuilder();
		builder.setStartPosition(new Vector2(25, 0));
		builder.setCss('play');
		builder.addLine("pause", (e) => this.showMainMenu());
		const menu = builder.build();
		this.model.setMenu(menu);
	}

	resume() {
		this.showPlayMenu();
		this.levelController.activate();
	}

	loadSavegame(name) {
		const store = localStorage.getItem('beehive-savegame-' + name);
		var level = null;
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

		this.hideMenu();
		this.loadLevel(level);

	}

}
