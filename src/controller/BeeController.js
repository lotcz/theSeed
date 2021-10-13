import ControllerBase from "./ControllerBase";

// max length of direction vector, pixels per second
const MAX_SPEED = 1500;

// how quickly will speed drop down, pixels per second
const SLOWDOWN_SPEED = 400;

// how quickly will speed build up, pixels per second
const SPEEDUP_SPEED = 800;

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

		let coords = this.model.image.coordinates.add(direction.multiply(secsDelta));
		const position = this.grid.getPosition(coords);
		const penetrable = this.level.isPenetrable(position);
		if (!penetrable) {
			coords = this.model.image.coordinates.subtract(direction.multiply(secsDelta));
			direction = direction.multiply(-0.5);
		}

		const speed = direction.size();

		// limit speed
		if (speed > MAX_SPEED) {
			direction.setSize(MAX_SPEED);
		}

		// apply movement
		if (speed > 0) {
			this.model.position.set(this.grid.getPosition(coords));
			this.level.centerOnCoordinates(coords);
			this.model.image.coordinates.set(coords);
		}

		this.model.direction.set(direction);
	}

}
