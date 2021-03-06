import AnimatedStrategy from "./AnimatedStrategy";
import Vector2 from "../../class/Vector2";
import Pixies from "../../class/Pixies";

const DEFAULT_MAX_AMOUNT = 5;
const DEFAULT_FALL_TIMEOUT = 200;
const DEFAULT_FLOAT_TIMEOUT = 500;

export default class ObjectStrategy extends AnimatedStrategy {
	maxAmount;

	constructor(game, model, controls, timeout) {
		super(game, model, controls, timeout);

		this.turnWhenMoving = true;
		this.maxAmount = DEFAULT_MAX_AMOUNT;
		this.defaultMoveTimeout = timeout;
		this.defaultFallTimeout = DEFAULT_FALL_TIMEOUT;
		this.defaultFloatTimeout = DEFAULT_FLOAT_TIMEOUT;
		this.lastAmount = null;
		this.timeout = 0;

		if (!this.model.data.amount) {
			this.model.data.amount = 1;
		}
	}

	activateInternal() {
		this.updateAmount();
		super.activateInternal();
	}

	updateStrategy() {
		this.defaultTimeout = this.defaultMoveTimeout;

		const down = this.grid.getNeighborDown(this.model.position);
		if (!this.level.isValidPosition(down)) {
			console.log('Object over board!', this.model);
			this.level.sprites.remove(this.model);
			return;
		}

		if (this.level.isWater(this.model.position)) {
			const up = this.grid.getNeighborUp(this.model.position);
			this.defaultTimeout = this.defaultFloatTimeout;
			this.setTargetPosition(up);
			return;
		}

		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = this.defaultFallTimeout;
			this.setTargetPosition(down);
			return;
		}

		const available = [];
		const ll = this.grid.getNeighborLowerLeft(this.model.position);
		if (this.level.isPenetrable(ll)) {
			available.push(ll);
		}
		const lr = this.grid.getNeighborLowerRight(this.model.position);
		if (this.level.isPenetrable(lr)) {
			available.push(lr);
		}
		if (available.length > 0) {
			this.defaultTimeout = this.defaultFallTimeout * 2;
			this.setTargetPosition(Pixies.randomElement(available));
		} else {
			this.defaultTimeout = this.defaultMoveTimeout;
		}

	}

	updateInternal(delta) {
		this.updateAmount();
		super.updateInternal(delta);
	}

	static getObjectScale(amount, maxAmount) {
		const portion = (amount / maxAmount);
		const scale = Math.sqrt(portion);
		return scale;
	}

	updateAmount() {
		if (this.lastAmount !== this.model.data.amount) {
			const portion = (this.model.data.amount / this.maxAmount);
			if (this.model.data.amount < this.maxAmount) {
				this.offset = new Vector2(0, this.grid.tileSize.y * 0.4 * (1 - portion));
			} else {
				this.offset = null;
			}
			if (this.isActivated() && !this.isMoving()) {
				this.setTargetCoordinates(this.getCoords(this.model.position));
			}
			const scale = Math.sqrt(portion);
			this.setTargetScale(scale);
			this.lastAmount = this.model.data.amount;
		}
	}

}
