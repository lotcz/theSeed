import ControllerBase from "./ControllerBase";
import LevelController from "./LevelController";

export default class GameController extends ControllerBase {
	constructor(model, controls) {
		super(model, model, controls);

		this.onResizeEvent = () => this.onResize();
	}

	activateInternal() {
		window.addEventListener('resize', this.onResizeEvent);
		this.onResize();
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
		this.onResize();
	}

	onResize() {
		this.model.viewBoxSize.set(window.innerWidth, window.innerHeight);
		if (this.model.level)
			this.model.level.viewBoxSize.set(this.model.viewBoxSize);
	}

}
