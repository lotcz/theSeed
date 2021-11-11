import ControllerBase from "../../class/ControllerBase";
import Sound from "../../class/Sound";
import AnimatedValue from "../../class/AnimatedValue";

export default class BeeLeavingStrategy extends ControllerBase {
	activateInternal() {
		this.scaleAnimation = new AnimatedValue(this.model.image.scale.get(), 0.01, 3000);
	}

	updateInternal(delta) {
		this.model.image.scale.set(this.scaleAnimation.get(delta));
	}

}
