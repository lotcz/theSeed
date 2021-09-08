import ControllerBase from "./ControllerBase";
import LevelController from "./LevelController";
import Vector2 from "../class/Vector2";
import LevelBuilder from "../builder/LevelBuilder";
import {GROUND_PRESET_HILL} from "../builder/GroundBuilder";
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
		const size = new Vector2(50, 100);
		const scale = 160;

		const levelBuilder = new LevelBuilder(size, scale);
		levelBuilder.ground(GROUND_PRESET_HILL);
		levelBuilder.setStartToTop();
		const level = levelBuilder.build();
		level.inventory = null;
		this.loadLevel(level);
	}

	showMainMenu() {
		const builder = new MenuBuilder();
		builder.setStartPosition(this.model.viewBoxSize.multiply(0.3));
		builder.setCss('main');
		builder.addLine("New Game", (e) => this.startGame());
		builder.addLine("Load Game", (e) => this.startGame());
		if (this.model.level && this.model.level.inventory)
			builder.addLine("Resume", (e) => this.resume());
		builder.setSize(this.model.viewBoxSize);
		const menu = builder.build();
		this.model.setMenu(menu);
		this.levelController.deactivate();
	}

	hideMenu() {
		this.model.setMenu(null);
	}

	showPlayMenu() {
		const builder = new MenuBuilder();
		//builder.setStartPosition(this.model.viewBoxSize.multiply(0.3));
		builder.setCss('play');
		builder.addLine("Menu", (e) => this.showMainMenu());
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

}
