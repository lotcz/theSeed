import ControllerBase from "../../class/ControllerBase";
import DeathSound from "../../../res/sound/death.mp3";
import Sound from "../../class/Sound";
import {IMAGE_BEE_DEAD, SPRITE_TYPE_BEE_DEAD} from "../../builder/sprites/SpriteStyleObjects";

const FALL_SPEED = 800; // pixels per second
const DEATH_TIMEOUT = 3000;

export default class BeeDeathStrategy extends ControllerBase {
	timeout;
	triggered;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.deathSound = new Sound(DeathSound);
	}

	activateInternal() {
		this.deathSound.play();
		this.game.beeState.health.set(0);
		this.model.direction.set(0,0);
		this.model.crawling.set(null);
		this.model.crawling.makeDirty();
		this.model.starsVisible.set(false);
		this.timeout = DEATH_TIMEOUT;
		this.triggered = false;
		this.parent.emptyInventory();
		this.model.image.path.set(IMAGE_BEE_DEAD);
		this.initialPosition = this.model.position.clone();
	}

	deactivateInternal() {
		const carcass = this.level.addSpriteFromStyle(this.initialPosition, SPRITE_TYPE_BEE_DEAD);
		carcass.isPersistent = false;
	}

	updateInternal(delta) {
		if (!this.triggered) {
			this.timeout -= delta;
			if (this.timeout <= 0) {
				this.model.triggerOnDeathEvent();
				this.triggered = true;
			}
		}

		if (this.level.isWater(this.model.position)) {
			const coords = this.model.coordinates.addY(-(delta / 1000) * FALL_SPEED / 3);
			if (this.level.isWater(this.grid.getPosition(coords))) {
				this.model.coordinates.set(coords);
				this.model.position.set(this.grid.getPosition(this.model.coordinates));
				this.parent.updateMovement();
			}
			return;
		}

		if (!this.level.isGround(this.model.position)) {
			this.model.coordinates.set(this.model.coordinates.addY((delta / 1000) * FALL_SPEED));
			this.model.position.set(this.grid.getPosition(this.model.coordinates));
			this.parent.updateMovement();
		}
	}

}
