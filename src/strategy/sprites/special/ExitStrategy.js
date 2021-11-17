import UpdatedStrategy from "../UpdatedStrategy";

const RESPAWN_TIMEOUT = 1000;

export default class ExitStrategy extends UpdatedStrategy {
	triggered;

	constructor(game, model, controls) {
		super(game, model, controls, RESPAWN_TIMEOUT);

		this.triggered = false;
	}

	activateInternal() {
		super.activateInternal();
		if (this.model.image) {
			this.model.image.coordinates.set(this.grid.getCoordinates(this.model.position));
		}
	}

	updateStrategy() {
		if (!this.level.bee) {
			return;
		}
		if (!this.triggered) {
			if (this.level.bee.health.get() > 0) {
				if (this.model.position.distanceTo(this.level.bee.position) < 3) {
					this.level.bee.position.set(this.model.position);
					this.level.bee.triggerOnTravelEvent(this.model.data.level);
					this.triggered = true;
				}
			}
		}
	}

}
