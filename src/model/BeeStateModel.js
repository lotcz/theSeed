import DirtyValue from "../class/DirtyValue";
import ModelBase from "../class/ModelBase";
import Pixies from "../class/Pixies";

export const MAX_HEALTH = 1;

export default class BeeStateModel extends ModelBase {
	lives;
	maxLives;
	health;

	constructor() {
		super();
		this.lives = new DirtyValue(0);
		this.addChild(this.lives);
		this.maxLives = new DirtyValue(0);
		this.addChild(this.maxLives);
		this.health = new DirtyValue(1);
		this.addChild(this.health);
	}

	getState() {
		return {
			lives: this.lives.getState(),
			maxLives: this.maxLives.getState(),
			health: this.health.getState(),
		}
	}

	restoreState(state) {
		if (state.lives) this.lives.restoreState(state.lives);
		if (state.maxLives) this.maxLives.restoreState(state.maxLives);
		if (state.health) this.health.restoreState(state.health);
	}

	isHurt() {
		return (this.health.get() < MAX_HEALTH);
	}

	isDead() {
		return (this.health.get() <= 0);
	}

	isAlive() {
		return !this.isDead();
	}

	hurt(amount) {
		if (this.isAlive()) {
			this.heal(-amount);
		}
	}

	heal(amount) {
		if (amount == 0) {
			return;
		}
		this.health.set(Pixies.between(0, 1, this.health.get() + amount));
		this.triggerEvent(amount < 0 ? 'hurt' : 'heal', Math.abs(amount));
	}

	addOnHurtListener(listener) {
		this.addEventListener('hurt', listener);
	}

	removeOnHurtListener(listener) {
		this.removeEventListener('hurt', listener);
	}

	addOnHealListener(listener) {
		this.addEventListener('heal', listener);
	}

	removeOnHealListener(listener) {
		this.removeEventListener('heal', listener);
	}

}

