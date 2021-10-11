import ControllerBase from "./ControllerBase";

// max length of direction vector, pixels per second
const MAX_SPEED = 1000;

// how quickly will speed drop down, pixels per second
const SLOWDOWN_SPEED = 300;

// how quickly will speed build up, pixels per second
const SPEEDUP_SPEED = 500;

export default class BeeController extends ControllerBase {

	constructor(game, model, controls) {
		super(game, model, controls);

		this.model.image.coordinates.set(this.grid.getCoordinates(this.model.position));
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

		this.model.direction.set(direction);

		// apply movement
		if (speed > 0) {
			let coords = this.model.image.coordinates.add(direction.multiply(secsDelta));
			this.level.centerOnCoordinates(coords);
			this.model.image.coordinates.set(coords);
		}

	}

}
