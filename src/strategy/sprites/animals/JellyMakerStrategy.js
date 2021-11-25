import HintController from "../../../controller/HintController";
import HintModel from "../../../model/HintModel";
import {IMAGE_POTASSIUM, SPRITE_STYLES, SPRITE_TYPE_PINK_JELLY, SPRITE_TYPE_POLLEN} from "../../../builder/SpriteStyle";
import StaticStrategy from "../StaticStrategy";
import {MINERAL_MAX_AMOUNT} from "../minerals/MineralStrategy";

const JELLY_MAKER_TIMEOUT = 2000;
const HINT_DISTANCE = 400;
const JELLY_MAKER_CONSUMED_AMOUNT = MINERAL_MAX_AMOUNT;

export default class JellyMakerStrategy extends StaticStrategy {
	hintController;

	constructor(game, model, controls) {
		super(game, model, controls, JELLY_MAKER_TIMEOUT);

		this.model._is_penetrable = false;
		this.model._is_crawlable = true;

		if (!this.model.data.consumesAmount) {
			this.model.data.consumesAmount = JELLY_MAKER_CONSUMED_AMOUNT;
		}
		if (!this.model.data.consumedAmount) {
			this.model.data.consumedAmount = 0;
		}
	}

	updateStrategy() {
		if (!this.hintController) {
			const hintModel = new HintModel();
			hintModel.position.set(this.model.position);
			if (this.model.data.consumes) {
				const style = SPRITE_STYLES[this.model.data.consumes];
				hintModel.imagePaths = [style.image.uri];
			} else if (this.model.data.hint) {
				hintModel.imagePaths = [...this.model.data.hint];
			} else {
				console.log('No hint type detected!');
			}
			if (this.model.data.hintSize !== undefined) {
				hintModel.size = this.model.data.hintSize;
			}
			if (this.model.data.hintDirection !== undefined) {
				hintModel.direction = this.model.data.hintDirection;
			}
			this.hintController = new HintController(this.game, hintModel, this.controls);
			this.addChild(this.hintController);
			this.hintController.activate();
		}

		if (this.level.isPlayable && this.level.bee && this.isHungry()) {
			const beeDistance = this.model.image.coordinates.distanceTo(this.level.bee.coordinates);
			if (this.hintController.isInitialized()) {
				if (beeDistance > (1.5 * HINT_DISTANCE)) {
					this.hintController.hide();
				} else {
					this.hintController.show();
				}
			} else {
				if (beeDistance < HINT_DISTANCE) {
					this.hintController.show();
				}
			}
		}

		if (this.isHungry()) {
			this.consume();
		} else {
			this.produce();
		}
	}

	consume() {
		if (!(this.isHungry() && this.model.data.consumes)) {
			return;
		}
		const area = this.grid.getAffectedPositions(this.model.position, 2);
		const consumables = area.reduce((prev, current) => prev.concat(this.chessboard.getVisitors(current, (v) => v._is_sprite && v.type === this.model.data.consumes)), []);
		if (consumables.length > 0) {
			const food = consumables[0];
			food.data.amount -= 1;
			this.model.data.consumedAmount += 1;
			if (food.data.amount <= 0) {
				this.level.sprites.remove(food);
			}
			this.updateScale();
		}
	}

	produce() {
		if (this.isHungry() || ! this.model.data.produces) {
			return;
		}
		this.model.data.consumedAmount = 0;
		this.level.addSpriteFromStyle(this.grid.getNeighborDown(this.model.position), this.model.data.produces);
		this.updateScale();
	}

	isHungry() {
		return (this.model.data.consumedAmount < this.model.data.consumesAmount);
	}

	updateScale() {
		const portion = this.model.data.consumedAmount / this.model.data.consumesAmount;
		const scale = 1 + (0.5 * portion);
		this.setTargetScale(scale);
	}

}
