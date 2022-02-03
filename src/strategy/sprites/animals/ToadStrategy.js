import StaticStrategy from "../StaticStrategy";
import {SPRITE_TYPE_PINK_JELLY} from "../../../builder/sprites/SpriteStyleMinerals";
import AnimatedVector2 from "../../../class/AnimatedVector2";
import {
	IMAGE_TOAD_HEAD,
	IMAGE_TOAD_HEAD_OPEN,
	SPRITE_TYPE_TOAD_BODY,
	SPRITE_TYPE_TOAD_TONGUE
} from "../../../builder/sprites/SpriteStyleAnimals";

const TOAD_TONGUE_LENGTH = 10;
const TOAD_TIMEOUT = 1000;
const TOAD_CLOSE_TIMEOUT = 500;
const TOAD_NOTICE_DISTANCE = 2000;
const TOAD_ATTACK_DISTANCE = 1500;

export default class ToadStrategy extends StaticStrategy {
	tongue;
	body;
	tongueAnimations;
	foodCoordinates;

	constructor(game, model, controls) {
		super(game, model, controls, TOAD_TIMEOUT);

		this.oriented = true;
		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		this.rotateAttachedSprite = false;
		this.model.attachedSpriteBehind = true;

		this.tongue = null;
		this.body = null;
		this.tongueAnimations = null;
		this.foodCoordinates = null;

		this.level.addResource(IMAGE_TOAD_HEAD_OPEN);

		if (this.model.attachedSprite.isEmpty()) {
			this.createAttachedSprites();
		} else {
			this.mapAttachedSprites();
		}

	}

	activateInternal() {
		super.activateInternal();
		this.deflateHead();
	}

	deactivateInternal() {
		//this.chessboard.removeVisitor(this.model.attachedSprite.get().position, this.model);
		super.deactivateInternal();
	}

	updateInternal(delta) {
		super.updateInternal(delta);
		if (this.tongueAnimations) {
			for (let i = 0; i < TOAD_TONGUE_LENGTH; i++) {
				this.tongue[i].image.coordinates.set(this.tongueAnimations[i].get(delta));
			}
			if (this.tongueAnimations[TOAD_TONGUE_LENGTH - 1].isFinished()) {
				this.tongueAnimations = null;
				this.snapped();
			}
		}
	}

	updateStrategy() {
		if (this.isSnapping()) {
			return;
		}

		this.model.image.path.set(IMAGE_TOAD_HEAD);

		if (this.model.image.scale.get() > 1) {
			this.deflateHead();
			return;
		}

		if (this.isFocused()) {
			this.eat();
		} else {
			this.lookForFood();
		}
	}

	// ATTACHED SPRITES

	createAttachedSprites() {
		const body = this.level.createSpriteFromStyle(this.model.position, SPRITE_TYPE_TOAD_BODY);
		body.position.set(this.model.position);
		body.image.coordinates.set(this.model.image.coordinates);
		this.model.attachedSprite.set(body);
		let sprite = body;
		for (let i = 0; i < TOAD_TONGUE_LENGTH; i++) {
			const t = this.level.createSpriteFromStyle(this.model.position, SPRITE_TYPE_TOAD_TONGUE);
			t.position.set(this.model.position);
			t.image.coordinates.set(this.model.image.coordinates);
			sprite.attachedSprite.set(t);
			sprite = t;
		}
		this.mapAttachedSprites();
	}

	mapAttachedSprites() {
		this.tongue = [];
		this.body = this.model.attachedSprite.get();
		this.body.position.set(this.model.position);
		this.body.image.coordinates.set(this.model.image.coordinates);
		let sprite = this.body;
		for (let i = 0; i < TOAD_TONGUE_LENGTH; i++) {
			const t = sprite.attachedSprite.get();
			if (t) {
				t.position.set(this.model.position);
				t.image.coordinates.set(this.model.image.coordinates);
				this.tongue[i] = sprite = t;
			}
		}
	}

	// DECISIONS

	isFocused() {
		return this.foodCoordinates;
	}

	inflateHead() {
		this.setTargetScale(1.2);
	}

	deflateHead() {
		this.setTargetScale(1);
	}

	lookForFood() {
		this.foodCoordinates = null;

		const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
		if (beeDistance < TOAD_NOTICE_DISTANCE) {
			this.foodCoordinates = this.level.bee.coordinates;
			this.defaultTimeout = TOAD_CLOSE_TIMEOUT;
			this.setTargetRotation(this.model.image.coordinates.getRotation(this.foodCoordinates));
		} else {
			this.defaultTimeout = TOAD_TIMEOUT;
			if (Math.random() < 0.2) {
				this.inflateHead();
			}
		}
	}

	eat() {
		if (!this.foodCoordinates) return;
		//if (this.animatedRotation) return;

		const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
		if (beeDistance < TOAD_ATTACK_DISTANCE) {
			this.snap(this.level.bee.coordinates);
		} else if (beeDistance < TOAD_NOTICE_DISTANCE) {
			this.foodCoordinates = this.level.bee.coordinates;
			this.setTargetRotation(this.model.image.coordinates.getRotation(this.foodCoordinates));
		} else {
			this.foodCoordinates = null;
		}
	}

	isSnapping() {
		return this.tongueAnimations;
	}

	snap(coordinates) {
		this.foodCoordinates = coordinates;
		this.tongueAnimations = [];
		const start = this.model.image.coordinates;
		for (let i = 0; i < TOAD_TONGUE_LENGTH; i++) {
			const tc = start.add(coordinates.subtract(start).multiply(i/(TOAD_TONGUE_LENGTH - 1)))
			this.tongueAnimations[i] = new AnimatedVector2(this.tongue[i].image.coordinates, tc, 500);
		}
		this.model.image.path.set(IMAGE_TOAD_HEAD_OPEN);
	}

	snapped() {
		if (!this.foodCoordinates) {
			return;
		}
		this.foodCoordinates = null;

		const lastTongue = this.tongue[TOAD_TONGUE_LENGTH - 1];
		const beeDistance = lastTongue.image.coordinates.distanceTo(this.level.bee.coordinates);
		if (beeDistance < 50) {
			this.inflateHead();
			this.game.beeState.hurt(0.1);
		}

		this.tongueAnimations = [];
		for (let i = 0; i < TOAD_TONGUE_LENGTH; i++) {
			this.tongueAnimations[i] = new AnimatedVector2(this.tongue[i].image.coordinates, this.model.image.coordinates, 1500);
		}
	}

}
