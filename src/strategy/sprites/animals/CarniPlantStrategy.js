import MouthTriggerStrategy from "../special/MouthTriggerStrategy";

export default class CarniPlantStrategy extends MouthTriggerStrategy {

	/**
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel} controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls);

		if (this.model.data.hurts === undefined) {
			this.model.data.hurts = 0.1;
		}
		if (!this.model.data.range) {
			this.model.data.range = 3;
		}
		this.hurtDistance = this.grid.tileRadius.get() * (this.model.data.range - 1) * 2;
	}

	updateStrategy() {
		super.updateStrategy();

		if (this.level.isPlayable && this.level.bee) {
			const distance = this.level.bee.coordinates.distanceTo(this.centerCoordinates);
			if (distance < this.hurtDistance) {
				this.game.beeState.hurt(this.model.data.hurts);
			}
		}
	}

}
