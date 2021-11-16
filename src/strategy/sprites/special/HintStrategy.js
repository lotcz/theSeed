import MovementStrategy from "../MovementStrategy";

const HINT_TIMEOUT = 1000;

export default class HintStrategy extends MovementStrategy {
	start;

	constructor(game, model, controls) {
		super(game, model, controls, HINT_TIMEOUT);

		this.turnWhenMoving = false;
	}

	activateInternal() {
		super.activateInternal();

		this.start = this.model.position.clone();
		this.timeout = 0;

	}

	updateStrategy() {
		if (this.model.data.isHiding) {
			if (this.model.position.equalsTo(this.start)) {
				this.model.triggerEvent('hidden');
			} else {
				this.setTargetPosition(this.start);
				this.setTargetScale(0.01);
			}
		} else {
			if (this.model.data.targetPosition) {
				this.setTargetPosition(this.model.data.targetPosition);
			}
			this.setTargetScale(this.model.data.targetScale || 2);
		}
	}

}
