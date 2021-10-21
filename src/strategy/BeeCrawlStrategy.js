import ControllerBase from "../class/ControllerBase";
import {BEE_CENTER, WINGS_OFFSET} from "../controller/BeeController";
import {
	CORNER_LEFT,
	CORNER_LOWER_LEFT,
	CORNER_LOWER_RIGHT,
	CORNER_RIGHT,
	CORNER_UPPER_LEFT,
	CORNER_UPPER_RIGHT,
	NEIGHBOR_TYPE_DOWN,
	NEIGHBOR_TYPE_LOWER_LEFT,
	NEIGHBOR_TYPE_LOWER_RIGHT,
	NEIGHBOR_TYPE_UP,
	NEIGHBOR_TYPE_UPPER_LEFT,
	NEIGHBOR_TYPE_UPPER_RIGHT
} from "../model/GridModel";
import RotationValue from "../class/RotationValue";
import Vector2 from "../class/Vector2";

const CRAWL_SPEED = 400; //pixels per second
const ROTATION_SPEED = 180; //angles per second

const CONTROLLER_DIRECTION_UP = 'up';
const CONTROLLER_DIRECTION_DOWN = 'down';
const CONTROLLER_DIRECTION_LEFT = 'left';
const CONTROLLER_DIRECTION_RIGHT = 'right';

const FALLBACK_STOP = 0;
const FALLBACK_FLY = 1;
const FALLBACK_PROCEED = 2;

const CRAWLING_MATRIX = [];

CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN] = {
	corners: [CORNER_LOWER_LEFT, CORNER_LOWER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLLER_DIRECTION_UP] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLLER_DIRECTION_DOWN] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLLER_DIRECTION_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_PROCEED
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT] = {
	corners: [CORNER_LEFT, CORNER_LOWER_LEFT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT] = {
	corners: [CORNER_LOWER_RIGHT, CORNER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_STOP
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_UP] = {
	corners: [CORNER_UPPER_LEFT, CORNER_UPPER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_UP] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_DOWN] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_PROCEED
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT] = {
	corners: [CORNER_LEFT, CORNER_UPPER_LEFT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_PROCEED,
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT] = {
	corners: [CORNER_UPPER_RIGHT, CORNER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_STOP
};

const CONTROLS_TIMEOUT = 500;

export default class BeeCrawlStrategy extends ControllerBase {
	targetCoordinates;
	targetRotation;
	timeout;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.targetCoordinates = null;
		this.targetRotation = null;
		this.timeout = CONTROLS_TIMEOUT;
	}

	activateInternal() {
		this.model.rotation.set(this.getRotation(this.model.crawling.get()));
		this.model.crawlingAnimation.image.coordinates.set(BEE_CENTER);
		this.updateBee();
	}

	updateInternal(delta) {
		if (this.model.crawling.get() === null) {
			this.parent.fly();
			return;
		}

		if ((this.targetCoordinates !== null) || (this.targetRotation !== null)) {
			const secsDelta = delta / 1000;
			if (this.targetCoordinates !== null) {
				const diff = this.targetCoordinates.subtract(this.model.coordinates);
				const distance = diff.size();
				if (distance === 0) {
					this.targetCoordinates = null;
				} else {
					diff.setSize(Math.min(distance, CRAWL_SPEED * secsDelta));
					this.model.coordinates.set(this.model.coordinates.add(diff));
				}
			}
			if (this.targetRotation !== null) {
				const diff = new RotationValue(this.targetRotation.get() - this.model.rotation.get()).get();
				if (Math.abs(diff) > 180) {
					console.log(diff);
				}
				if (diff === 0) {
					this.targetRotation = null;
				} else {
					let step = ((diff < 0) ? -1 : 1) * ROTATION_SPEED * secsDelta;
					if (Math.abs(step) > Math.abs(diff)) {
						step = diff;
					}
					this.model.rotation.add(step);
				}
			}
			this.updateBee();
			return;
		}

		if (this.timeout > 0) {
			this.timeout -= delta;
			return;
		}

		if (this.controls.anyMovement()) {
			let controllerDirection = null;
			if (this.controls.moveUp) {
				controllerDirection = CONTROLLER_DIRECTION_UP;
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT) {
					this.model.headingLeft.set(true);
				}
				if (this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT) {
					this.model.headingLeft.set(false);
				}
			} else if (this.controls.moveDown) {
				controllerDirection = CONTROLLER_DIRECTION_DOWN;
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT) {
					this.model.headingLeft.set(false);
				}
				if (this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT) {
					this.model.headingLeft.set(true);
				}
			}
			if (this.controls.moveLeft) {
				controllerDirection = CONTROLLER_DIRECTION_LEFT;
				this.model.headingLeft.set(true);
			} else if (this.controls.moveRight) {
				controllerDirection = CONTROLLER_DIRECTION_RIGHT;
				this.model.headingLeft.set(false);
			}
			const matrix = CRAWLING_MATRIX[this.model.crawling.get()];
			if (!matrix) {
				console.log('Matrix not found');
				return;
			}
			const options = matrix.options[controllerDirection];
			if (options === false) {
				return;
			} else if (options === true) {
				this.parent.fly();
				return;
			} else {
				let fallBack = true;

				const nextPosition = this.grid.getNeighbor(this.model.position, options.nextPosition);

				if (options.skipMovement !== true) {
					if (this.level.isPenetrable(nextPosition)) {
						this.model.position.set(nextPosition);
						this.targetCoordinates = this.grid.getCoordinates(nextPosition);
						this.model.crawling.set(options.nextNeighbor);
						this.targetRotation = new RotationValue(this.getRotation(options.nextNeighbor));
						fallBack = false;
					}
				} else {
					if (this.level.isCrawlable(nextPosition)) {
						this.model.crawling.set(options.nextPosition);
						this.targetRotation = new RotationValue(this.getRotation(options.nextPosition));
						fallBack = false;
					}
				}

				if (fallBack) {
					if (options.fallback === FALLBACK_PROCEED) {
						if (this.level.isCrawlable(nextPosition)) {
							this.model.crawling.set(options.nextPosition);
							this.targetRotation = new RotationValue(this.getRotation(options.nextPosition));
						}
					} else if (options.fallback === FALLBACK_FLY) {
						this.parent.fly();
						return;
					}
				}
			}
		}
	}

	updateBee() {
		const rotation = this.model.rotation.get();
		this.model.crawlingAnimation.image.rotation.set(rotation);
		this.model.crawlingAnimation.image.flipped.set(this.model.headingLeft.get());
		this.model.starsAnimation.image.rotation.set(rotation);
		this.model.starsAnimation.image.flipped.set(this.model.headingLeft.get());

		// apply movement
		this.level.centerOnCoordinates(this.model.coordinates);
		this.level.sanitizeViewBox();
	}

	getRotation(direction) {
		return (60 * (direction - 3));
	}

}
