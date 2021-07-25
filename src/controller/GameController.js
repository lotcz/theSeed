import ControllerBase from "./ControllerBase";
import LevelController from "./LevelController";

export default class GameController extends ControllerBase {
	constructor(model, controls) {
		super(model, model, controls);

		this.levelController = new LevelController(model, model.level, controls);
		this.addChild(this.levelController);

		this.onResizeEvent = () => this.onResize();
		this.onResize();
	}

	activateInternal() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
	}

	deactivateInternal() {
		window.removeEventListener('resize', this.onResizeEvent);
	}

	onResize() {
		this.model.level.viewBoxSize.set(window.innerWidth, window.innerHeight);
	}

}
