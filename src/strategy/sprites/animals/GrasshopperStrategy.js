import FriendStrategy from "./FriendStrategy";
import {SPRITE_TYPE_GRASSHOPPER_BODY} from "../../../builder/sprites/SpriteStyleAnimals";
import Pixies from "../../../class/Pixies";

const GRASSHOPPER_TIMEOUT = 2000;
const GRASSHOPPER_CLOSE_TIMEOUT = 500;
const GRASSHOPPER_NOTICE_DISTANCE = 2000;

export default class GrasshopperStrategy extends FriendStrategy {
	hintController;

	constructor(game, model, controls) {
		super(game, model, controls, GRASSHOPPER_TIMEOUT);

		this.oriented = true;
		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		this.rotateAttachedSprite = false;
		this.flipAttachedSprite = false;
		this.model.attachedSpriteBehind = true;

		if (this.model.attachedSprite.isEmpty()) {
			const body = this.level.createSpriteFromStyle(this.grid.getNeighborLowerRight(this.grid.getNeighborDown(this.model.position, 2)), SPRITE_TYPE_GRASSHOPPER_BODY);
			this.model.attachedSprite.set(body);
		}

	}

	activateInternal() {
		super.activateInternal();
		const bodyPosition = this.grid.getNeighborLowerRight(this.grid.getNeighborDown(this.model.position, 2));
		this.model.attachedSprite.get().position.set(bodyPosition);
		this.model.attachedSprite.get().image.coordinates.set(this.grid.getCoordinates(bodyPosition));
		this.chessboard.addVisitor(bodyPosition, this.model);
	}

	deactivateInternal() {
		this.chessboard.removeVisitor(this.model.attachedSprite.get().position, this.model);
		super.deactivateInternal();
	}

	updateStrategy() {
		super.updateStrategy();

		if (this.level.isPlayable && this.level.bee) {
			const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
			if (beeDistance < GRASSHOPPER_NOTICE_DISTANCE) {
				this.defaultTimeout = GRASSHOPPER_CLOSE_TIMEOUT;
				this.setTargetRotation(this.model.image.coordinates.getRotation(this.level.bee.coordinates));
			} else {
				this.defaultTimeout = GRASSHOPPER_TIMEOUT;
				const flipped = this.model.image.flipped.get() ? 1 : -1;
				this.setTargetRotation(Pixies.random(flipped * 130, flipped * 120));
			}
		}
	}

}
