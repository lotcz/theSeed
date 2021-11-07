import ControllerBase from "../class/ControllerBase";
import {NEIGHBOR_TYPE_UP, NEIGHBOR_TYPE_UPPER_RIGHT} from "../model/GridModel";
import {
	IMAGE_HINT_BACKGROUND,
	STRATEGY_HINT
} from "../builder/SpriteStyle";

const BUBBLES_COUNT = 3;

export default class HintController extends ControllerBase {
	background;
	hint;

	constructor(game, model, controls) {
		super(game, model, controls);

		this.background = [];
		this.hint = null;

	}

	activateInternal() {
		this.deactivateInternal();
		let position = this.model.position.clone();
		for (let i = 0; i < BUBBLES_COUNT; i++) {
			position = this.grid.getNeighbor(position, this.model.direction);
			const sprite = this.addSprite(this.model.position, STRATEGY_HINT, {targetScale: ((i + 1) / BUBBLES_COUNT), targetPosition: position, isHiding: false, }, IMAGE_HINT_BACKGROUND, 0.01);
			sprite.isPersistent = false;
			this.background.push(sprite);
		}
		position = this.grid.getNeighbor(position, this.model.direction, 2);
		const positions = this.grid.getAffectedPositions(position, 2);
		for (let i = 0, max = positions.length; i < max; i++) {
			const sprite = this.addSprite(this.model.position, STRATEGY_HINT, {targetScale: 1.5, targetPosition: positions[i], isHiding: false}, IMAGE_HINT_BACKGROUND, 0.5);
			this.background.push(sprite);
		}
		this.hint = this.addSprite(this.model.position, STRATEGY_HINT, {targetScale: 2, targetPosition: position, isHiding: false}, this.model.imagePath, 0.3);
		this.hint.addEventListener('hidden', () => this.deactivate());
	}

	deactivateInternal() {
		this.background.forEach((b) => this.level.sprites.remove(b));
		this.background = [];
		if (this.hint) {
			this.level.sprites.remove(this.hint);
			this.hint = null;
		}
	}

	show() {
		if (!this.isActivated()) {
			this.activate();
		} else {
			this.background.forEach((b) => b.data.isHiding = false);
			this.hint.data.isHiding = false;
		}
	}

	hide() {
		if (this.isActivated()) {
			this.background.forEach((b) => b.data.isHiding = true);
			this.hint.data.isHiding = true;
		}
	}

	addSprite(position, strategy, data, imagePath, scale) {
		const sprite = this.level.addSprite(position, strategy, data, imagePath, scale);
		sprite.isPersistent = false;
		return sprite;
	}
}
