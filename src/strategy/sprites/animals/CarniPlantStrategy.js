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
	}

	close() {
		super.close();

		if (this.level.isPlayable) {
			this.game.beeState.hurt(this.model.data.hurts);
		}
	}

}
