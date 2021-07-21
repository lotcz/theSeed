import ControllerBase from "./ControllerBase";
import LevelController from "./LevelController";

export default class GameController extends ControllerBase {
	constructor(grid, model, controls) {
		super(grid, model, controls);

		this.levelController = new LevelController(grid, model.level, controls);

		this.onResizeEvent = () => this.onResize();
		this.onResize();
	}

	activate() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
	}

	deactivate() {
		window.removeEventListener('resize', this.onResizeEvent);
	}

	update(delta) {
		this.levelController.update(delta);
	}

	onResize() {
		this.model.level.viewBoxSize.set(window.innerWidth, window.innerHeight);
	}

}
