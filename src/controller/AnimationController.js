import ControllerBase from "../class/ControllerBase";

export default class AnimationController extends ControllerBase {
	currentFrame;
	frameDelay;
	frameTimeout;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.currentFrame = 0;
		this.frameDelay = 1000 / this.model.frameRate.get();
		this.frameTimeout = this.frameDelay;
	}

	updateInternal(delta) {
		if (this.model.paused.get()) return;

		if (this.frameTimeout <= 0) {
			this.currentFrame += 1;
			if (this.currentFrame >= this.model.paths.length) {
				this.currentFrame = 0;
			}
			this.model.image.path.set(this.model.paths[this.currentFrame]);
			this.frameTimeout = this.frameDelay;
		}
		this.frameTimeout -= delta;
	}

}
