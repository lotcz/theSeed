import AnimatedStrategy from "../AnimatedStrategy";

const SWITCH_TIMEOUT = 99000;

export default class SwitchStrategy extends AnimatedStrategy {
	on;

	constructor(game, model, controls) {
		super(game, model, controls, SWITCH_TIMEOUT);

		this.level.addResource(this.model.data.imageOn);
		this.level.addResource(this.model.data.imageOff);

		if (this.model.data.on === undefined) {
			this.model.data.on = false;
		}
		this.on = this.model.data.on;
		this.updateImage();
	}

	updateInternal(delta) {
		if (this.on !== this.model.data.on) {
			this.on = this.model.data.on;
			this.updateImage();
		}
	}

	updateImage() {
		const path = this.on ? this.model.data.imageOn : this.model.data.imageOff;
		this.model.image.path.set(path);
	}

}
