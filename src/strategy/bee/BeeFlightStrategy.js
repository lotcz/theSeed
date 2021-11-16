import ControllerBase from "../../class/ControllerBase";
import Sound from "../../class/Sound";
import HitSound from "../../../res/sound/hit.wav";

import {BEE_CENTER} from "../../controller/BeeController";
import {IMAGE_BEE, IMAGE_BEE_DEAD} from "../../builder/SpriteStyle";
import {MINERAL_MAX_AMOUNT} from "../sprites/minerals/MineralStrategy";
import Pixies from "../../class/Pixies";
import AnimatedValue from "../../class/AnimatedValue";
import AnimatedVector2 from "../../class/AnimatedVector2";

// max length of direction vector, pixels per second
const MAX_SPEED = 1500;

// max length of direction vector to allow crawling
const MAX_CRAWL_SPEED = 1000;

// how quickly will speed drop down, pixels per second
const SLOWDOWN_SPEED = 400;

// how quickly will speed build up, pixels per second
const SPEEDUP_SPEED = 800;

export default class BeeFlightStrategy extends ControllerBase {
	static hitSound = new Sound(HitSound);
	wingRotation;
	speed;
	dead;
	leaving;
	scaleAnimation;
	coordinatesAnimation;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.wingRotation = 0;
		this.speed = 0;
		this.dead = false;
		this.leaving = false;
	}

	activateInternal() {
		this.model.image.path.set(IMAGE_BEE);
		this.model.leftWing.flipped.set(false);
		this.model.rightWing.flipped.set(true);
		this.model.starsAnimation.image.rotation.set(0);
		this.model.direction.set(0,0);
		this.speed = 0;
		this.updateBee();
	}

	updateInternal(delta) {
		const secsDelta = delta / 1000;

		//animate wings
		if (this.wingRotation > 60) {
			this.wingRotation = -60;
		}
		this.wingRotation += secsDelta * (100 + (400 * this.speed / MAX_SPEED));

		if (this.leaving) {
			this.model.scale.set(this.scaleAnimation.get(delta));
			this.model.coordinates.set(this.coordinatesAnimation.get(delta));
			this.updateBee();
			this.parent.updateMovement();
			return;
		}

		//this.parent.inspectForMinerals(this.grid.getNeighborDown(this.model.position));

		let direction = this.model.direction;

		if (this.controls.anyMovement() && !this.dead) {
			const carriedAmount = this.model.inventory.children.reduce((prev, current) => prev + current.data.amount, 0);
			const speedup = SPEEDUP_SPEED * (1 - Pixies.between(0, 0.5, 0.5 * carriedAmount / MINERAL_MAX_AMOUNT));
			if (this.controls.moveUp) {
				direction = direction.addY(-speedup * secsDelta);
			} else if (this.controls.moveDown) {
				direction = direction.addY(speedup * secsDelta);
			}
			if (this.controls.moveLeft) {
				direction = direction.addX(-speedup * secsDelta);
				this.model.headingLeft.set(true);
			} else if (this.controls.moveRight) {
				direction = direction.addX(speedup * secsDelta);
				this.model.headingLeft.set(false);
			}
		} else {
			//slow down
			this.speed = direction.size();
			if (this.speed > 0) {
				const slowDown = (this.dead) ? SLOWDOWN_SPEED * 4 : SLOWDOWN_SPEED;
				direction.setSize(Math.max(0, this.speed - (slowDown * secsDelta)));
			}
		}

		this.speed = direction.size();

		// limit speed
		if (this.speed > MAX_SPEED) {
			direction.setSize(MAX_SPEED);
		}


		if (this.speed <= 0) {
			if (this.dead) {
				this.parent.die();
				return;
			}
			this.speed = 0;
			this.updateBee();
			return;
		}

		const distance = direction.multiply(secsDelta);
		const crashDistance = distance.clone();
		crashDistance.setSize(crashDistance.size() + this.grid.tileRadius.get());
		let coords = null;
		let position = null;
		const crashCoords = this.model.coordinates.add(crashDistance);
		let crashPosition = this.grid.getPosition(crashCoords);
		const penetrable = this.level.isPenetrable(crashPosition);
		if (penetrable) {
			coords = this.model.coordinates.add(distance);
			position = this.grid.getPosition(coords);
		} else {
			if (this.speed < MAX_CRAWL_SPEED && this.level.isCrawlable(crashPosition)) {
				const crawl = this.grid.getNeighborType(this.model.position, crashPosition);
				if (crawl !== undefined) {
					this.parent.crawl(crawl);
					return;
				}
			}

			BeeFlightStrategy.hitSound.replay();
			this.parent.emptyInventory();

			this.model.hurt(0.5 * this.speed / MAX_SPEED);
			if (this.model.health.get() <= 0) {
				this.dead = true;
				this.model.health.set(0.001);
			}

			coords = this.model.coordinates.subtract(distance);
			direction = direction.multiply(-0.5);

			const newPosition = this.grid.getPosition(coords);
			const newPenetrable = this.level.isPenetrable(newPosition);
			if (!newPenetrable) {
				const nei = this.grid.getNeighbors(this.model.position);
				const free = nei.filter((n) => this.level.isPenetrable(n));
				if (free.length > 0) {
					position = newPosition;
					coords = this.grid.getCoordinates(free[0]);
				} else {
					console.log('Lost');
				}
			} else {
				position = this.grid.getPosition(coords);
			}

		}

		// apply movement
		this.model.position.set(position);
		this.model.coordinates.set(coords);
		this.model.direction.set(direction);
		this.updateBee();
		this.parent.updateMovement();
	}

	updateBee() {
		this.model.image.flipped.set(this.model.headingLeft.get());
		this.model.starsAnimation.image.flipped.set(this.model.headingLeft.get());

		const rotation = Math.abs(this.wingRotation) - 30;
		this.model.leftWing.rotation.set(rotation);
		this.model.rightWing.rotation.set(-rotation);

		let idle = BEE_CENTER.addY((rotation / 3) * (1 - (this.speed / MAX_SPEED)));

		this.model.image.coordinates.set(idle);
		this.model.leftWing.coordinates.set(idle);
		this.model.rightWing.coordinates.set(idle);
	}

	leave() {
		this.leaving = true;
		this.scaleAnimation = new AnimatedValue(this.model.scale.get(), 0.1, 2000);
		this.coordinatesAnimation = new AnimatedVector2(this.model.coordinates, this.grid.getCoordinates(this.model.position), 2000);
	}
}
