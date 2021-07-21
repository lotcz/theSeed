import MovementStrategy from "./MovementStrategy";
import Random from "../class/Random";
import Vector2 from "../class/Vector2";

const TURNER_TIMEOUT = -1;

export default class TurnerStrategy extends MovementStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, model.image.position, model.image.coordinates, TURNER_TIMEOUT);

		this.start = this.game.level.plant.roots.position.addX(-5).addY(-10);
	}

	selectTargetInternal() {
		this.target = this.game.level.highlightedTilePosition;
	}

	updateInternal(delta) {
		this.setPosition(this.start);
		if (this.target && !this.position.equalsTo(this.target)) {
			this.model.image.rotation.set(this.position.getAngleToY(this.target));
		}
	}

}
