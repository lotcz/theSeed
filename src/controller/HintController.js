import ControllerBase from "../class/ControllerBase";
import {NEIGHBOR_TYPE_UPPER_RIGHT} from "../model/GridModel";
import {
	IMAGE_HINT_BACKGROUND,
	STRATEGY_HINT
} from "../builder/SpriteStyle";

const BUBBLES_COUNT = 3;
const HINT_DIRECTION = NEIGHBOR_TYPE_UPPER_RIGHT;

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
			position = this.grid.getNeighbor(position, HINT_DIRECTION);
			const sprite = this.level.addSprite(this.model.position.clone(), STRATEGY_HINT, {targetScale: ((i + 1) / BUBBLES_COUNT), targetPosition: position.clone(), isHiding: false}, IMAGE_HINT_BACKGROUND, 0.01);
			this.background.push(sprite);
		}
		position = this.grid.getNeighbor(position, HINT_DIRECTION, 2);
		const positions = this.grid.getAffectedPositions(position, 2);
		for (let i = 0, max = positions.length; i < max; i++) {
			const sprite = this.level.addSprite(this.model.position.clone(), STRATEGY_HINT, {targetScale: 1.5, targetPosition: positions[i].clone(), isHiding: false}, IMAGE_HINT_BACKGROUND, 0.5);
			this.background.push(sprite);
		}
		this.hint = this.level.addSprite(this.model.position.clone(), STRATEGY_HINT, {targetScale: 2, targetPosition: position.clone(), isHiding: false}, this.model.imagePath.get(), 0.3);
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

}
