import SpriteStrategy from "./SpriteStrategy";
import Pixies from "../../class/Pixies";

export const DEFAULT_UPDATE_TIMEOUT = 1000;

export default class UpdatedStrategy extends SpriteStrategy {
	defaultTimeout;
	timeout;
	randomizeTimeout;
	randomizeInitialTimeout;
	initialTimeoutRandomized;

	constructor(game, model, controls, timeout) {
		super(game, model, controls);

		this.defaultTimeout = timeout || DEFAULT_UPDATE_TIMEOUT;
		this.timeout = Math.random() * this.defaultTimeout;
		this.randomizeTimeout = false;
		this.randomizeInitialTimeout = true;
		this.initialTimeoutRandomized = false;
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
			if (this.randomizeTimeout || (this.randomizeInitialTimeout && !this.initialTimeoutRandomized)) {
				this.timeout = Pixies.random(this.defaultTimeout * 0.5, this.defaultTimeout * 1.5);
				this.initialTimeoutRandomized = true;
			} else {
				this.timeout = this.defaultTimeout;
			}
		}
		this.updateInternal(delta);
	}

}
