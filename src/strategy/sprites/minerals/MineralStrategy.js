import ObjectStrategy from "../ObjectStrategy";
import {STRATEGY_MINERAL} from "../../../builder/SpriteStyle";

const MINERAL_TIMEOUT = 1000;

export const MINERAL_MAX_AMOUNT = 5;

export default class MineralStrategy extends ObjectStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, MINERAL_TIMEOUT);

		this.maxAmount = MINERAL_MAX_AMOUNT;
	}

	updateStrategy() {
		super.updateStrategy();

		this.model._is_penetrable = (this.model.data.amount < MINERAL_MAX_AMOUNT);
		this.model._is_crawlable = !this.model._is_penetrable;
	}

	updateStillObject() {
		if (this.model.data.amount > MINERAL_MAX_AMOUNT) {
			const amount = this.model.data.amount - MINERAL_MAX_AMOUNT;
			this.separate(amount);
		}

		const visitors = this.chessboard.getTile(this.model.position)
			.filter((v) =>
				v !== this.model
				&& v._is_sprite === true
				&& v.strategy.get() === STRATEGY_MINERAL
				&& v.type === this.model.type);
		visitors.forEach((v) => this.absorb(v));
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
			this.model.data.amount -= amount;
			const sprite = this.level.addSpriteFromStyle(position, this.model.type);
			sprite.data.amount = amount;
		}
	}

	absorb(node) {
		if (node.data.amount <= this.model.data.amount && node.image.scale.get() <= this.model.image.scale.get()) {
			this.model.data.amount += node.data.amount;
			this.level.sprites.remove(node);
		}
	}

}
