import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";

const TURNER_TIMEOUT = 100;

export default class TurnerStrategy extends SpriteControllerStrategy {
	constructor(game, model, controls) {
		super(game, model, controls, TURNER_TIMEOUT);

		this.start = this.game.level.plant.roots.position.addX(-5).addY(-10);
		this.movementEnabled = false;
	}

	selectTargetInternal() {
		this.target = this.game.level.highlightedTilePosition;
	}

	updateInternal(delta) {
		this.setPosition(this.start);
	}

}