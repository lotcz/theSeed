import ControllerBase from "../class/ControllerBase";
import {BEE_CENTER} from "../controller/BeeController";
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

const CONTROLLER_DIRECTION_UP = 'up';
const CONTROLLER_DIRECTION_DOWN = 'down';
const CONTROLLER_DIRECTION_LEFT = 'left';
const CONTROLLER_DIRECTION_RIGHT = 'right';

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
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT] = {
	corners: [CORNER_LEFT, CORNER_LOWER_LEFT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_LEFT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_UP];
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_RIGHT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLLER_DIRECTION_DOWN];

CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT] = {
	corners: [CORNER_LOWER_RIGHT, CORNER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_LEFT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_DOWN];
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_RIGHT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLLER_DIRECTION_UP];

CRAWLING_MATRIX[NEIGHBOR_TYPE_UP] = {
	corners: [CORNER_UPPER_LEFT, CORNER_UPPER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_UP] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_DOWN] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLLER_DIRECTION_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT] = {
	corners: [CORNER_LEFT, CORNER_UPPER_LEFT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_LEFT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_DOWN];
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_RIGHT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLLER_DIRECTION_UP];

CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT] = {
	corners: [CORNER_UPPER_RIGHT, CORNER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_UP] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_LEFT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_UP];
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_RIGHT] = CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLLER_DIRECTION_DOWN];

export default class BeeCrawlStrategy extends ControllerBase {
	constructor(game, model, controls) {
		super(game, model, controls);

	}

	activateInternal() {
		this.updateBee();
		this.model.leftWing.coordinates.set(BEE_CENTER);
		this.model.rightWing.coordinates.set(BEE_CENTER);
		this.model.imageCrawl.coordinates.set(BEE_CENTER);
	}

	updateInternal(delta) {
		if (this.model.crawling.get() === null) {
			this.parent.fly();
			return;
		}

		if (this.controls.anyMovement()) {
			let controllerDirection = null;
			if (this.controls.moveUp) {
				controllerDirection = CONTROLLER_DIRECTION_UP;
			} else if (this.controls.moveDown) {
				controllerDirection = CONTROLLER_DIRECTION_DOWN;
			}
			if (this.controls.moveLeft) {
				controllerDirection = CONTROLLER_DIRECTION_LEFT;
			} else if (this.controls.moveRight) {
				controllerDirection = CONTROLLER_DIRECTION_RIGHT;
			}
			const matrix = CRAWLING_MATRIX[this.model.crawling.get()];
			const options = matrix.options[controllerDirection];
			if (options === false) {
				return;
			} else if (options === true) {
				this.parent.fly();
				return;
			} else {
				const nextPosition = this.grid.getNeighbor(this.model.position, options.nextPosition);
				if (this.level.isPenetrable(nextPosition)) {
					this.model.position.set(nextPosition);
					this.model.crawling.set(options.nextNeighbor);
				} else if (this.level.isCrawlable(nextPosition)) {
					this.model.crawling.set(options.nextPosition);
				} else {
					this.parent.fly();
					return;
				}
				this.updateBee();
			}
		}

	}

	updateBee() {
		//const matrix = CRAWLING_MATRIX[this.model.crawling.get()];
		//const corners = matrix.corners.map((c) => this.grid.getCorner(this.model.position, c));
		//const coordinates = corners[0].add(corners[1]).multiply(0.5);
		const coordinates = this.grid.getCoordinates(this.model.position);
		this.model.coordinates.set(coordinates);
		const rotation = (60 * (this.model.crawling.get() - 3));
		const left = this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT;
		this.model.imageCrawl.rotation.set(rotation);
		this.model.imageCrawl.flipped.set(left);
		this.model.leftWing.rotation.set(rotation - 10);
		this.model.leftWing.flipped.set(left);
		this.model.rightWing.rotation.set(rotation - 20);
		this.model.rightWing.flipped.set(left);

		// apply movement
		this.level.centerOnCoordinates(coordinates);
		this.level.sanitizeViewBox();
	}

}
