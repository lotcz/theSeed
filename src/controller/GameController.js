import ControllerBase from "./ControllerBase";
import LevelController from "./LevelController";
import Vector2 from "../class/Vector2";
import LevelBuilder from "../builder/LevelBuilder";
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
	}

	loadLevel(levelModel) {
		this.model.loading.set(true);
		if (this.levelController) this.removeChild(this.levelController);
		this.model.setLevel(levelModel);
		this.levelController = new LevelController(this.model, this.model.level, this.controls);
		this.addChild(this.levelController);
		this.levelController.activate();
		this.showPlayMenu();
		this.onResize();
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		if (this.model.level)
			this.model.level.viewBoxSize.set(this.model.viewBoxSize);
	}

	loadBackground() {
		const size = new Vector2(250, 250);
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
		builder.addLine("New Game", (e) => this.startGame());
		builder.addLine("Load Level", (e) => this.showLevelSelection());
		builder.addLine("Playground", (e) => this.playground());
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
		builder.addLine("Level 1", (e) => this.startGame());
		builder.addLine("Level 2", (e) => this.playground());
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
		//builder.setStartPosition(this.model.viewBoxSize.multiply(0.3));
		builder.setCss('play');
		builder.addLine("menu", (e) => this.showMainMenu());
		const menu = builder.build();
		this.model.setMenu(menu);
	}

	resume() {
		this.showPlayMenu();
		this.levelController.activate();
	}

	startGame() {
		const size = new Vector2(500, 100);
		const scale = 80;

		const levelBuilder = new LevelBuilder(size, scale);
		const level = levelBuilder.build();
		const spriteBuilder = new SpriteBuilder(level);
		spriteBuilder.addBugs();
		//spriteBuilder.addTurner();
		spriteBuilder.addNutrients();

		this.hideMenu();
		this.loadLevel(level);

	}

	playground() {
		const size = new Vector2(100, 200);
		const scale = 60;

		const levelBuilder = new LevelBuilder(size, scale);
		const level = levelBuilder.build();
		const spriteBuilder = new SpriteBuilder(level);
		spriteBuilder.addBugs();
		spriteBuilder.addTurner();
		spriteBuilder.addNutrients();

		this.hideMenu();
		this.loadLevel(level);
	}
}
