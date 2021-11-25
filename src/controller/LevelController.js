import ControllerBase from "../class/ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";
import BeeController from "./BeeController";
import GroundController from "./GroundController";
import Sound from "../class/Sound";
import {START_LEVEL} from "../model/GameModel";

const DEBUG_LEVEL_CONTROLLER = true;

export default class LevelController extends ControllerBase {
	isDead;
	travelling; // false or level name
	isFadingIn;
	music;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.isDead = false;
		this.travelling = false;
		this.isFadingIn = false;
		this.music = null;

		this.groundController = new GroundController(game, model.ground, controls);
		this.addChild(this.groundController);

		this.spritesController = new SpriteCollectionController(game, model.sprites, controls);
		this.addChild(this.spritesController);

		this.beeChanged();
	}

	beeChanged() {
		if (this.beeController) {
			this.removeChild(this.beeController);
			this.beeController = null;
		}
		if (this.model.bee) {
			this.beeController = new BeeController(this.game, this.model.bee, this.controls);
			this.addChild(this.beeController);
			if (this.isActivated()) {
				this.beeController.activate();
			}
			this.model.bee.addOnDeathListener(() => this.onDeath());
			this.model.bee.addOnTravelListener((param) => this.onTravel(param));
			this.fadeIn();
		}
	}

	onDeath() {
		this.isDead = true;
		this.travelling = false;
		this.isFadingIn = false;
		this.model.clipAmount.set(0);
	}

	onTravel(levelName) {
		this.travelling = levelName;
		this.isDead = false;
		this.isFadingIn = false;
		this.model.clipAmount.set(0);
	}

	fadeIn() {
		this.isFadingIn = true;
		this.isDead = false;
		this.travelling = false;
		this.model.clipAmount.set(1);
	}

	activateInternal() {
		if (DEBUG_LEVEL_CONTROLLER) console.log('Activated level controller');
		if (this.model.levelMusic.isEmpty()) {
			if (this.music) this.music.pause();
			this.music = null;
			if (DEBUG_LEVEL_CONTROLLER) console.log('level music empty');
		} else {
			const resource = this.game.resources.get(this.model.levelMusic.get());
			if (this.music && resource && this.music.audio.src === resource.data) {
				this.music.play();
				if (DEBUG_LEVEL_CONTROLLER) console.log('restored playing');
			} else {
				if (this.music) this.music.pause();
				this.music = null;
				if (resource && resource.data) {
					this.music = new Sound(resource.data, {loop: true});
					this.music.play();
					if (DEBUG_LEVEL_CONTROLLER) console.log('loaded level music:', resource.uri);
				}
			}
		}
	}

	deactivateInternal() {
		if (this.music) this.music.pause();
		if (DEBUG_LEVEL_CONTROLLER) console.log('Deactivated level controller');
	}

	updateInternal(delta) {
		if (this.beeController && this.beeController.isDeleted()) {
			this.beeChanged();
		}

		if (this.isFadingIn) {
			if (this.model.clipAmount.get() > 0) {
				this.model.clipCenter.set(this.model.bee.coordinates);
				this.model.clipAmount.set(Math.max(this.level.clipAmount.get() - (0.5 * delta / 1000), 0));
			} else {
				this.isFadingIn = false;
			}
		}

		if ((this.isDead === true) || (this.travelling !== false)) {
			if (this.level.clipAmount.get() < 1) {
				if (DEBUG_LEVEL_CONTROLLER) console.log(`Fading out`);
				this.level.clipCenter.set(this.model.bee.coordinates);
				this.level.clipAmount.set(Math.min(this.level.clipAmount.get() + (0.5 * delta / 1000), 1));
			} else {
				if (this.travelling !== false) {
					if (DEBUG_LEVEL_CONTROLLER) console.log(`Travelling to ${this.travelling}`);
					this.game.levelName.set(this.travelling);
					this.travelling = false;
				} else {
					if (this.level.name === START_LEVEL) {
						if (DEBUG_LEVEL_CONTROLLER) console.log('Died in start level');
						if (this.game.lives.get() > 0) {
							this.game.lives.set(this.game.lives.get() - 1);
						}
						this.model.spawn(this.model.bee, 'start');
						this.beeChanged();
						this.fadeIn();
					} else {
						if (this.game.lives.get() <= 0) {
							if (DEBUG_LEVEL_CONTROLLER) console.log('Died and transferring to start level.');
							this.game.lives.set(this.game.maxLives.get() || 0);
							this.game.levelName.set(START_LEVEL);
						} else {
							if (DEBUG_LEVEL_CONTROLLER) console.log('Died and respawning.');
							this.game.lives.set(this.game.lives.get() - 1);
							this.model.spawn(this.model.bee, this.game.lastLevelName);
							this.beeChanged();
							this.fadeIn();
						}
					}
					this.isDead = false;
				}
			}
		}

	}

}
