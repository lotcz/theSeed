import SpriteStrategy from "./SpriteStrategy";

export default class UpdatedStrategy extends SpriteStrategy {
	defaultTimeout;
	timeout;

	constructor(game, model, controls, timeout) {
		super(game, model, controls);

		this.defaultTimeout = timeout;
		this.timeout = Math.random() * this.defaultTimeout;
	}

	updateStrategy() {

	}

	update(delta) {
		this.timeout -= delta;
		if (this.timeout <= 0) {
			if (!this.level.isValidPosition(this.model.position)) {
				this.level.sprites.remove(this.model);
				console.log('Sprite over board!', this.model);
				return;
			}
			if (!this.game.isInEditMode.get()) {
				this.updateStrategy();
			}
			this.timeout = this.defaultTimeout;
		}
		this.updateInternal(delta);
	}

}
