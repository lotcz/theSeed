import SpriteControllerStrategy from "./SpriteControllerStrategy";
import Pixies from "../class/Pixies";
import Vector2 from "../class/Vector2";
import SpriteBuilder, {IMAGE_WORM_BODY, IMAGE_WORM_BUTT} from "../builder/SpriteBuilder";
import {STRATEGY_WORM} from "../controller/SpriteController";

const WORM_TIMEOUT = 2500;
const MAX_WORM_LENGTH = 15;

export default class WormStrategy extends SpriteControllerStrategy {
	butt;

	constructor(game, model, controls) {
		super(game, model, controls, WORM_TIMEOUT);

		if (!this.model.data.wormLength) {
			this.model.data.wormLength = 1;
		}

		this.defaultTimeout = WORM_TIMEOUT / this.model.data.wormLength;

		this.butt = null;
	}

	addButt() {
		this.model.data.wormLength += 1;
		const spriteBuilder = new SpriteBuilder(this.game.level);
		const image = (this.butt) ? IMAGE_WORM_BODY : IMAGE_WORM_BUTT;
		const butt = spriteBuilder.addSprite(this.position, this.model.image.scale.get(), false, this.model.image.rotation.get(), image, STRATEGY_WORM, {head:this.model, wormLength:this.model.data.wormLength});
		if (this.butt) {
			this.butt.data.head = butt;
		}
		this.butt = butt;

	}

	selectTargetHead() {
		if (Math.random() < 0.5) return;

		const neighbors = this.game.level.grid.getValidNeighbors(this.position);
		const groundNeighbors = neighbors.filter((n) => this.game.level.isUnderGround(n));
		if (groundNeighbors.length > 0) {
			const position = Pixies.randomElement(groundNeighbors);
			const visitors = this.game.level.grid.chessboard.getTile(position);
			if (visitors.length === 0) {
				this.model.data.lastPosition = this.position.clone();
				this.setTarget(position);
				if (this.model.data.wormLength < MAX_WORM_LENGTH) {
					if (Math.random() < 0.2) {
						this.addButt();
					}
				}
			}
		}
	}

	selectTargetBody() {
		const position = this.model.data.head.data.lastPosition;
		if (!position) return;
		const visitors = this.game.level.grid.chessboard.getTile(position);
		if (visitors.length === 0) {
			this.model.data.lastPosition = this.position.clone();
			this.setTarget(position);
		} else {
			this.setTarget(null);
		}
	}

	selectTargetInternal() {
		if (this.model.data.head) {
			this.selectTargetBody();
		} else {
			this.selectTargetHead();
		}
	}

}