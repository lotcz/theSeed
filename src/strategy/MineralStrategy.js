import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import SpriteBuilder, {IMAGE_WATER, IMAGE_WORM_BODY, IMAGE_WORM_BUTT} from "../builder/SpriteBuilder";
import {STRATEGY_WATER, STRATEGY_WORM} from "../controller/SpriteController";

const MINERAL_UNIT_SIZE = 0.1;

export default class MineralStrategy extends SpriteControllerStrategy {
	insideUp;

	constructor(game, model, controls) {
		super(game, model, controls, 10000);


	}

	selectTargetInternal() {

		//this.setTarget(down);

	}

	updateInternal(delta) {
		const scale = Math.sqrt(this.model.data.amount / (4 * Math.PI))
		this.model.image.scale.set(scale * 2);
	}

	findEmptyNeighbor() {
		const neighbors = this.grid.getNeighbors(this.position);
		const empty = neighbors.filter((n) => this.chessboard.getTile(n).length === 0);
		return Pixies.randomElement(empty);
	}

	spawn() {
		const position = this.findEmptyNeighbor();
		if (!position) return;

		const spriteBuilder = new SpriteBuilder(this.level);
		const spawn = spriteBuilder.addSprite(position, this.model.image.scale.get(), this.model.image.flipped.get(), this.model.image.rotation.get(), this.model.image.path, this.model.strategy.get(), this.model.data);
		//this.model.data.amount -= WATER_UNIT_SIZE;
		this.model.makeDirty();
		return spawn;
	}

	onClick(e) {
		this.spawn();
	}

}
