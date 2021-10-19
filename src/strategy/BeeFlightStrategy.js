import ControllerBase from "../class/ControllerBase";
import {BEE_CENTER} from "../controller/BeeController";
import Vector2 from "../class/Vector2";

// max length of direction vector, pixels per second
const MAX_SPEED = 1500;

// how quickly will speed drop down, pixels per second
const SLOWDOWN_SPEED = 400;

// how quickly will speed build up, pixels per second
const SPEEDUP_SPEED = 800;

export default class BeeFlightStrategy extends ControllerBase {
	wingRotation;
	speed;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.wingRotation = 0;
		this.speed = 0;
	}

	activateInternal() {
		this.model.direction.set(0,0);
		this.speed = 0;
		this.updateBee();
	}

	updateInternal(delta) {
		const secsDelta = delta / 1000;

		let direction = this.model.direction;

		if (this.controls.anyMovement()) {
			if (this.controls.moveUp) {
				direction = direction.addY(-SPEEDUP_SPEED * secsDelta);
			} else if (this.controls.moveDown) {
				direction = direction.addY(SPEEDUP_SPEED * secsDelta);
			}
			if (this.controls.moveLeft) {
				direction = direction.addX(-SPEEDUP_SPEED * secsDelta);
				this.model.image.flipped.set(true);
			} else if (this.controls.moveRight) {
				direction = direction.addX(SPEEDUP_SPEED * secsDelta);
				this.model.image.flipped.set(false);
			}
		} else {
			//slow down
			const speed = direction.size();
			if (speed > 0) {
				direction.setSize(Math.max(0, speed - (SLOWDOWN_SPEED * secsDelta)));
			}
		}

		const speed = direction.size();

		// limit speed
		if (speed > MAX_SPEED) {
			direction.setSize(MAX_SPEED);
		}

		//animate wings
		if (this.wingRotation > 60) {
			this.wingRotation = -60;
		}
		this.wingRotation += secsDelta * (100 + (400 * speed / MAX_SPEED));

		if (speed === 0) {
			this.updateBee();
			return;
		}

		let coords = this.model.coordinates.add(direction.multiply(secsDelta));
		let position = this.grid.getPosition(coords);
		const penetrable = this.level.isPenetrable(position);
		if (!penetrable) {
			coords = this.model.coordinates.subtract(direction.multiply(secsDelta));

			if (speed < MAX_SPEED) {
				this.parent.crawl(this.grid.getNeighborType(this.model.position, position));
				return;
			} else {
				direction = direction.multiply(-0.5);

				const newPosition = this.grid.getPosition(coords);
				const newPenetrable = this.level.isPenetrable(newPosition);
				if (!newPenetrable) {
					const nei = this.grid.getNeighbors(position);
					const free = nei.filter((n) => this.level.isPenetrable(n));
					if (free.length > 0) {
						position = newPosition;
						coords = this.grid.getCoordinates(free[0]);
					} else {
						console.log('Lost');
					}
				}
			}
		}

		// apply movement
		this.model.position.set(position);
		this.model.coordinates.set(coords);
		this.model.direction.set(direction);
		this.speed = speed;
		this.updateBee();

		this.level.centerOnCoordinates(coords);
		this.level.sanitizeViewBox();
	}

	updateBee() {
		this.model.leftWing.flipped.set(false);
		this.model.rightWing.flipped.set(true);
		const rotation = Math.abs(this.wingRotation) - 30;
		this.model.leftWing.rotation.set(rotation);
		this.model.rightWing.rotation.set(-rotation);

		let idle = BEE_CENTER.addY((rotation / 3) * (1 - (this.speed / MAX_SPEED)));

		this.model.image.coordinates.set(idle);
		this.model.leftWing.coordinates.set(idle);
		this.model.rightWing.coordinates.set(idle);
	}

}
