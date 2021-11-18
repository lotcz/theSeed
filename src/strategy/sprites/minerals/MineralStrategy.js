import MovementStrategy from "../MovementStrategy";
import {STRATEGY_MINERAL} from "../../../builder/SpriteStyle";
import Pixies from "../../../class/Pixies";
import Vector2 from "../../../class/Vector2";

const MINERAL_TIMEOUT = 1000;
export const MINERAL_FALL_TIMEOUT = 200;
const DEBUG_MINERAL_STRATEGY = true;

export const MINERAL_MAX_AMOUNT = 5;

export default class MineralStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, MINERAL_TIMEOUT);

		if (!this.model.data.amount) {
			this.model.data.amount = this.model.image.scale.get();
		}

		this.timeout = 0;
	}

	activateInternal() {
		this.updateAmount();
		super.activateInternal();
	}

	updateInternal(delta) {
		if (this.lastAmount !== this.model.data.amount) {
			this.amountChanged();
		}
		super.updateInternal(delta);
	}

	updateStrategy() {
		if (this.model.data.amount > MINERAL_MAX_AMOUNT) {
			const amount = this.model.data.amount - MINERAL_MAX_AMOUNT;
			this.separate(amount);
		}

		const down = this.grid.getNeighborDown(this.model.position);
		if (!this.level.isValidPosition(down)) {
			console.log('Mineral over board.');
			this.level.sprites.remove(this.model);
			return;
		}

		if (this.level.isWater(this.model.position)) {
			const up = this.grid.getNeighborUp(this.model.position);
			this.defaultTimeout = MINERAL_TIMEOUT;
			this.setTargetPosition(up);
			return;
		}

		if (this.level.isPenetrable(down)) {
			this.defaultTimeout = MINERAL_FALL_TIMEOUT;
			this.setTargetPosition(down);
			return;
		} else {
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
				this.defaultTimeout = MINERAL_FALL_TIMEOUT * 2;
				this.setTargetPosition(Pixies.randomElement(available));
			} else {
				this.defaultTimeout = MINERAL_TIMEOUT;
			}
		}

		const visitors = this.chessboard.getTile(this.model.position)
			.filter((v) =>
				v !== this.model
				&& v._is_sprite === true
				&& v.strategy.get() === STRATEGY_MINERAL
				&& v.type === this.model.type);
		visitors.forEach((v) => this.absorb(v));

		this.model._is_penetrable = (this.model.data.amount < MINERAL_MAX_AMOUNT);
		this.model._is_crawlable = (this.model.data.amount >= MINERAL_MAX_AMOUNT);
	}

	static getScale(amount) {
		const scale = Math.sqrt(amount / (4 * Math.PI));
		return (scale * 2);
	}

	updateAmount() {
		const scale = MineralStrategy.getScale(this.model.data.amount);
		this.setTargetScale(scale);if (this.model.data.amount < MINERAL_MAX_AMOUNT) {
			this.offset = new Vector2(0, this.grid.tileSize.y * 0.4 * (1 - (this.model.data.amount / MINERAL_MAX_AMOUNT)));
		} else {
			this.offset = null;
		}
		this.lastAmount = this.model.data.amount;
	}

	amountChanged() {
		this.updateAmount();
		if (!this.isMoving()) {
			this.setTargetCoordinates(this.getCoords(this.model.position));
		}
	}

	separate(amount) {
		if (amount > this.model.data.amount) amount = this.model.data.amount;
		let position = this.grid.getNeighborUp(this.model.position);
		if (!this.level.isPenetrable(position)) {
			position = this.grid.getNeighborUpperLeft(this.model.position);
			if (!this.level.isPenetrable(position)) {
				position = this.grid.getNeighborUpperRight(this.model.position);
			}
		}
		if (this.level.isPenetrable(position)) {
			if (DEBUG_MINERAL_STRATEGY) console.log('Separate');
			this.model.data.amount -= amount;
			this.amountChanged();
			const sprite = this.level.addSpriteFromStyle(position, this.model.type);
			sprite.data.amount = amount;
		}
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount && node.image.scale.get() <= this.model.image.scale.get()) {
			if (DEBUG_MINERAL_STRATEGY) console.log('Absorb');
			this.model.data.amount += node.data.amount;
			this.amountChanged();
			this.model.makeDirty();
			this.level.sprites.remove(node);
		}
	}

}
