import UpdatedStrategy from "../UpdatedStrategy";

const RESPAWN_TIMEOUT = 1000;

export default class ExitStrategy extends UpdatedStrategy {
	triggered;

	constructor(game, model, controls) {
		super(game, model, controls, RESPAWN_TIMEOUT);

		this.triggered = false;
	}

	updateStrategy() {
		if (!this.triggered) {
			if (this.model.position.distanceTo(this.level.bee.position) < 3) {
				console.log('Exit');
				this.level.bee.triggerOnTravelEvent(this.model.data.level);
				this.triggered = true;
			}
		}
	}

}
