import ControllerBase from "../../class/ControllerBase";
import {BEE_CENTER, WINGS_OFFSET} from "../../controller/BeeController";
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
} from "../../model/GridModel";
import RotationValue from "../../class/RotationValue";
import Vector2 from "../../class/Vector2";

import CrawlSound from "../../../res/sound/crawl.wav";
import Sound from "../../class/Sound";
import {
	CONTROLS_DOWN,
	CONTROLS_LEFT, CONTROLS_LOWER_LEFT, CONTROLS_LOWER_RIGHT,
	CONTROLS_RIGHT,
	CONTROLS_UP,
	CONTROLS_UPPER_LEFT, CONTROLS_UPPER_RIGHT
} from "../../model/ControlsModel";

const CRAWL_SPEED = 400; //pixels per second
const ROTATION_SPEED = 180; //angles per second

const FALLBACK_STOP = 0;
const FALLBACK_FLY = 1;
const FALLBACK_PROCEED = 2;

const CRAWLING_MATRIX = [];

CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN] = {
	corners: [CORNER_LOWER_LEFT, CORNER_LOWER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_UP] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_DOWN] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_UPPER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_LOWER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_UPPER_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_DOWN].options[CONTROLS_LOWER_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_PROCEED
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT] = {
	corners: [CORNER_LEFT, CORNER_LOWER_LEFT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_UP] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_UPPER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_LOWER_LEFT] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_UPPER_RIGHT] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_LEFT].options[CONTROLS_LOWER_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT] = {
	corners: [CORNER_LOWER_RIGHT, CORNER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_UP] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_UPPER_LEFT] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_LOWER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_DOWN,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_UPPER_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_DOWN,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_LOWER_RIGHT].options[CONTROLS_LOWER_RIGHT] = false;

CRAWLING_MATRIX[NEIGHBOR_TYPE_UP] = {
	corners: [CORNER_UPPER_LEFT, CORNER_UPPER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_UP] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_DOWN] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_UPPER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_LOWER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_UPPER_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UPPER_LEFT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UP].options[CONTROLS_LOWER_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UPPER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_PROCEED
};

CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT] = {
	corners: [CORNER_LEFT, CORNER_UPPER_LEFT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_UP] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_PROCEED,
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_UPPER_LEFT] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_LOWER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_LEFT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_UPPER_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_LEFT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_LEFT].options[CONTROLS_LOWER_RIGHT] = true;

CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT] = {
	corners: [CORNER_UPPER_RIGHT, CORNER_RIGHT],
	options: []
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_UP] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_DOWN] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_PROCEED
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_UPPER_LEFT] = {
	nextPosition: NEIGHBOR_TYPE_UP,
	nextNeighbor: NEIGHBOR_TYPE_LOWER_RIGHT,
	fallback: FALLBACK_FLY,
	skipMovement: true
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_LOWER_LEFT] = true;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_RIGHT] = {
	nextPosition: NEIGHBOR_TYPE_LOWER_RIGHT,
	nextNeighbor: NEIGHBOR_TYPE_UP,
	fallback: FALLBACK_STOP
};
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_UPPER_RIGHT] = false;
CRAWLING_MATRIX[NEIGHBOR_TYPE_UPPER_RIGHT].options[CONTROLS_LOWER_RIGHT] = {
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
		this.crawlSound = new Sound(CrawlSound);
	}

	activateInternal() {
		this.crawlSound.play();
		this.model.rotation.set(this.getRotation(this.model.crawling.get()));
		this.model.crawlingAnimation.image.coordinates.set(BEE_CENTER);
		this.updateBee();
	}

	updateInternal(delta) {
		if (this.model.crawling.get() === null) {
			this.parent.fly();
			return;
		} else {
			const crawlingPosition = this.grid.getNeighbor(this.model.position, this.model.crawling.get());
			if (!this.level.isCrawlable(crawlingPosition)) {
				this.parent.fly();
				return;
			}
			this.parent.inspectForMinerals(crawlingPosition);
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
			this.model.crawlingAnimation.paused.set(false);
			return;
		} else {
			this.model.crawlingAnimation.paused.set(true);
		}

		if (this.timeout > 0) {
			this.timeout -= delta;
			return;
		}

		if (this.controls.anyMovement()) {
			if (this.controls.movingUp.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT) {
					this.model.headingLeft.set(true);
				}
				if (this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT) {
					this.model.headingLeft.set(false);
				}
			} else if (this.controls.movingDown.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_LEFT) {
					this.model.headingLeft.set(false);
				}
				if (this.model.crawling.get() === NEIGHBOR_TYPE_LOWER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT) {
					this.model.headingLeft.set(true);
				}
			}
			if (this.controls.movingLeft.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UP) {
					this.model.headingLeft.set(false);
				} else {
					this.model.headingLeft.set(true);
				}
			} else if (this.controls.movingRight.get()) {
				if (this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_LEFT || this.model.crawling.get() === NEIGHBOR_TYPE_UPPER_RIGHT || this.model.crawling.get() === NEIGHBOR_TYPE_UP) {
					this.model.headingLeft.set(true);
				} else {
					this.model.headingLeft.set(false);
				}
			}
			const matrix = CRAWLING_MATRIX[this.model.crawling.get()];
			if (!matrix) {
				console.log('Matrix not found');
				return;
			}
			const options = matrix.options[this.controls.direction.get()];
			if (options === false || options === undefined) {
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
		this.parent.updateMovement();
	}

	getRotation(direction) {
		return (60 * (direction - 3));
	}

}
