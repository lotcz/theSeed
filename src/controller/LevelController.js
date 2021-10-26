import ControllerBase from "../class/ControllerBase";
import SpriteCollectionController from "./SpriteCollectionController";
import BeeController from "./BeeController";
import GroundController from "./GroundController";

export default class LevelController extends ControllerBase {
	isDead;
	travelling; // false or level name
	isFadingIn;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.isDead = false;
		this.travelling = false;
		this.isFadingIn = false;

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
		//this.model.clipAmount.set(1);
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

		if (this.isDead || this.travelling !== false) {
			if (this.level.clipAmount.get() < 1) {
				this.level.clipCenter.set(this.model.bee.coordinates);
				this.level.clipAmount.set(Math.min(this.level.clipAmount.get() + (0.5 * delta / 1000), 1));
			} else {
				if (this.travelling !== false) {
					this.game.levelName.set(this.travelling);
					this.travelling = false;
				} else {
					if (this.level.name === 'beehive') {
						this.model.spawn(this.model.bee, 'start');
						this.beeChanged();
						this.fadeIn();
					} else {
						if (this.model.bee.lives.get() <= 0) {
							this.game.levelName.set('beehive');
						} else {
							this.model.bee.lives.set(this.model.bee.lives.get() - 1);
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
