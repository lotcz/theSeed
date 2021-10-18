import ControllerBase from "../class/ControllerBase";
import {STRATEGY_MINERAL} from "../builder/SpriteStyle";
import {GROUND_TYPE_WAX} from "../builder/GroundStyle";

// max length of direction vector, pixels per second
const MAX_SPEED = 1500;

// how quickly will speed drop down, pixels per second
const SLOWDOWN_SPEED = 400;

// how quickly will speed build up, pixels per second
const SPEEDUP_SPEED = 800;

export default class BeeController extends ControllerBase {
	wingRotation;
	speed;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.updateCoordinates();
		this.wingRotation = 0;
	}

	updateCoordinates() {
		const coords = this.grid.getCoordinates(this.model.position);
		this.setCoordinates(coords);
	}

	setCoordinates(coords) {
		this.model.coordinates.set(coords);
		this.updateBeeCoordinates();
	}

	updateBeeCoordinates() {
		const rotation = Math.abs(this.wingRotation) - 30;
		this.model.leftWing.rotation.set(rotation);
		this.model.rightWing.rotation.set(-rotation);

		const coords = this.model.coordinates.addY(rotation / 10);
		this.model.image.coordinates.set(coords);
		this.model.leftWing.coordinates.set(coords);
		this.model.rightWing.coordinates.set(coords);
	}

	emptyInventory() {
		const item = this.model.inventory.removeFirst();
		if (item) {
			item.position.set(this.model.position);
			this.level.sprites.add(item);
		}
	}

	updateInternal(delta) {
		const secsDelta = delta / 1000;

		if (this.controls.interact) {
			const position = this.grid.getNeighborDown(this.model.position)
			const visitors = this.chessboard.getVisitors(position);
			const minerals = visitors.filter((v) => v._is_sprite && v.strategy.get() === STRATEGY_MINERAL);
			if (minerals.length > 0) {
				this.level.sprites.remove(minerals[0]);
				this.model.inventory.add(minerals[0]);
			} else {
				const wax = visitors.filter((v) => v._is_ground && v.type === GROUND_TYPE_WAX);
				if (wax.length > 0) {
					const tile = wax[0];
					this.level.ground.removeTile(tile);
				}
			}
			this.controls.interact = false;
		}

		if (this.controls.fire) {
			this.emptyInventory();
			this.controls.fire = false;
		}

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
			this.updateBeeCoordinates();
			return;
		}

		let coords = this.model.coordinates.add(direction.multiply(secsDelta));
		let position = this.grid.getPosition(coords);
		const penetrable = this.level.isPenetrable(position);
		if (!penetrable) {
			coords = this.model.coordinates.subtract(direction.multiply(secsDelta));
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

		// apply movement
		this.model.position.set(position);
		this.level.centerOnCoordinates(coords);
		this.level.sanitizeViewBox();

		this.setCoordinates(coords);

		this.model.direction.set(direction);
		this.speed = speed;
	}

}
