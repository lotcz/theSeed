import AnimatedVector2 from "../../../class/AnimatedVector2";
import UpdatedStrategy from "../UpdatedStrategy";
import {IMAGE_CARNI_PLANT_MOUTH, SPRITE_TYPE_CARNI_PLANT_MOUTH} from "../../../builder/sprites/SpriteStyleAnimals";
import {NEIGHBOR_TYPE_DOWN, NEIGHBOR_TYPE_LOWER_RIGHT, NEIGHBOR_TYPE_UPPER_RIGHT} from "../../../model/GridModel";
import Vector2 from "../../../class/Vector2";

const CARNI_PLANT_TIMEOUT = 1000;
const CARNI_PLANT_CLOSE_TIMEOUT = 500;
const CARNI_PLANT_NOTICE_DISTANCE = 1000;
const CARNI_PLANT_ATTACK_DISTANCE = 500;
const CARNI_PLANT_DEFAULT_MOUTH_LENGTH = 5;

export default class CarniPlantStrategy extends UpdatedStrategy {
	mouth;
	mouthLength;
	openDirection;
	closedDirection;
	centerPosition;
	attackDistance;
	mouthAnimations;
	isOpen;

	/**
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel} controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls, CARNI_PLANT_TIMEOUT);

		this.oriented = true;
		this.model._is_penetrable = false;
		this.model._is_crawlable = false;

		this.mouthAnimations = null;
		this.mouth = [];
		this.model.data.isOpen = this.model.data.isOpen === undefined ? true : this.model.data.isOpen;
		this.mouthLength = this.model.data.mouthLength || CARNI_PLANT_DEFAULT_MOUTH_LENGTH;
		this.openDirection = this.model.data.openDirection === undefined ? NEIGHBOR_TYPE_UPPER_RIGHT : this.model.data.openDirection;
		this.closedDirection = this.model.data.closedDirection === undefined ? NEIGHBOR_TYPE_LOWER_RIGHT : this.model.data.closedDirection;
		this.attackDistance = this.model.data.attackDistance || CARNI_PLANT_ATTACK_DISTANCE;

		if (this.model.data.centerPosition) {
			this.centerPosition = new Vector2(this.model.data.centerPosition);
		} else {
			this.centerPosition = this.grid.getNeighbor(
				this.grid.getNeighbor(this.model.position, this.closedDirection, Math.floor(this.mouthLength / 2)),
				NEIGHBOR_TYPE_DOWN,
				Math.floor(this.mouthLength / 4));
		}
		this.centerCoordinates = this.grid.getCoordinates(this.centerPosition);

		if (this.model.attachedSprite.isEmpty()) {
			this.createAttachedSprites();
		} else {
			this.mapAttachedSprites();
		}
	}

	activateInternal() {
		super.activateInternal();
		this.addMouthVisitors();
	}

	deactivateInternal() {
		super.deactivateInternal();
		this.removeMouthVisitors();
	}

	updateInternal(delta) {
		super.updateInternal(delta);

		if (this.isAnimating()) {
			for (let i = 0; i < this.mouth.length; i++) {
				const oldPosition = this.mouth[i].position.clone();
				this.mouth[i].image.coordinates.set(this.mouthAnimations[i].get(delta));
				this.mouth[i].position.set(this.grid.getPosition(this.mouth[i].image.coordinates));
				if (this.mouth[i].position.equalsTo(this.level.bee.position)) {
					this.level.bee.direction.add(oldPosition.subtract(this.mouth[i].position));
				}
				if (!oldPosition.equalsTo(this.mouth[i].position)) {
					this.chessboard.removeVisitor(oldPosition, this.model);
					this.chessboard.addVisitor(this.mouth[i].position, this.model);
				}
			}
			if (this.mouthAnimations[this.mouth.length - 1].isFinished()) {
				this.mouthAnimations = null;
			}
		}
	}

	updateStrategy() {
		if (this.isAnimating()) {
			return;
		}

		if (this.level.isPlayable && this.level.bee) {
			if (this.model.data.isOpen) {
				const distance = this.level.bee.coordinates.distanceTo(this.centerCoordinates);
				if (distance < CARNI_PLANT_NOTICE_DISTANCE) {
					this.defaultTimeout = CARNI_PLANT_CLOSE_TIMEOUT;
					if (distance < CARNI_PLANT_ATTACK_DISTANCE) {
						this.openClose();
					}
				} else {
					this.defaultTimeout = CARNI_PLANT_TIMEOUT;
				}
			}
		}
	}

	// ATTACHED SPRITES

	createAttachedSprites() {
		let sprite = this.model;
		for (let i = 0; i <= this.mouthLength; i++) {
			const m = this.level.createSpriteFromStyle(this.model.position, SPRITE_TYPE_CARNI_PLANT_MOUTH);
			sprite.attachedSprite.set(m);
			sprite = m;
		}
		this.mapAttachedSprites();
	}

	mapAttachedSprites() {
		this.mouth = [];
		let sprite = this.model;
		let position = this.model.position;
		for (let i = 0; i <= this.mouthLength; i++) {
			const m = sprite.attachedSprite.get();
			if (m) {
				m.position.set(position);
				m.image.coordinates.set(this.grid.getCoordinates(position));
				this.chessboard.addVisitor(position, this.model);
				position = this.grid.getNeighbor(position, this.model.data.isOpen ? this.openDirection : this.closedDirection);
				this.mouth[i] = sprite = m;
			}
		}
	}

	isAnimating() {
		return this.mouthAnimations;
	}

	openClose() {
		this.model.data.isOpen = !this.model.data.isOpen;
		this.mouthAnimations = [];
		let position = this.model.position;
		for (let i = 0; i < this.mouth.length; i++) {
			this.mouthAnimations[i] = new AnimatedVector2(this.mouth[i].image.coordinates, this.grid.getCoordinates(position), CARNI_PLANT_TIMEOUT);
			position = this.grid.getNeighbor(position, this.model.data.isOpen ? this.openDirection : this.closedDirection);
		}
	}

	addMouthVisitors() {
		this.mouth.forEach((m) => this.chessboard.addVisitor(m.position, this.model));
	}

	removeMouthVisitors() {
		this.mouth.forEach((m) => this.chessboard.removeVisitor(m.position, this.model));
	}

}
