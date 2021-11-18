import ControllerBase from "../class/ControllerBase";
import {
	IMAGE_HINT_BACKGROUND,
	SPRITE_TYPE_HINT,
	STRATEGY_HINT
} from "../builder/SpriteStyle";
import SpriteModel from "../model/SpriteModel";
import Sound from "../class/Sound";
import AhaSound from "../../res/sound/a-ha.mp3";
import AnimationController from "./AnimationController";
import AnimationModel from "../model/AnimationModel";

const BUBBLES_COUNT = 3;

export default class HintController extends ControllerBase {
	static ahaSound = new Sound(AhaSound);
	background;
	hint;
	ahaTimer;
	sprites;

	constructor(game, model, controls, sprites = null) {
		super(game, model, controls);

		this.background = [];
		this.hint = null;
		this.sprites = sprites || this.level.sprites;
		this.ahaTimer = null;
		this.playSoundHandler = () => HintController.ahaSound.play();
		this.hiddenHandler = () => this.destroy();
	}

	show() {
		if (!this.isInitialized()) {
			this.initialize();
		} else {
			this.background.forEach((b) => b.data.isHiding = false);
			this.hint.data.isHiding = false;
		}
	}

	hide() {
		if (this.isInitialized()) {
			this.background.forEach((b) => b.data.isHiding = true);
			this.hint.data.isHiding = true;
		}
	}

	isInitialized() {
		return this.hint !== null;
	}

	initialize() {
		this.destroy();
		let position = this.model.position.clone();
		for (let i = 0; i < BUBBLES_COUNT; i++) {
			position = this.grid.getNeighbor(position, this.model.direction);
			const sprite = this.addSprite(this.model.position, {targetScale: ((i + 1) / BUBBLES_COUNT), targetPosition: position, isHiding: false, }, IMAGE_HINT_BACKGROUND, 0.01);
			sprite.isPersistent = false;
			this.background.push(sprite);
		}
		position = this.grid.getNeighbor(position, this.model.direction, 2);
		const positions = this.grid.getAffectedPositions(position, 2);
		for (let i = 0, max = positions.length; i < max; i++) {
			const sprite = this.addSprite(this.model.position, {targetScale: 2, targetPosition: positions[i], isHiding: false}, IMAGE_HINT_BACKGROUND, 0.5);
			this.background.push(sprite);
		}
		const defaultImage = this.model.imagePaths[0];
		this.hint = this.addSprite(this.model.position, {targetScale: 2, targetPosition: position, isHiding: false}, defaultImage, 0.3);
		if (this.model.imagePaths.length > 1) {
			this.model.imagePaths.forEach((path) => this.level.addResource(path));
			const anim = new AnimationModel({paths: this.model.imagePaths, frameRate: 0.33});
			anim.image = this.hint.image;
			const animationController = new AnimationController(this.game, anim, this.controls);
			this.addChild(animationController);
			animationController.activate();
		}

		this.hint.addEventListener('hidden', this.hiddenHandler);
		this.ahaTimer = setTimeout(this.playSoundHandler, 1000);
	}

	destroy() {
		this.resetChildren();
		this.background.forEach((b) => this.sprites.remove(b));
		this.background = [];
		if (this.hint) {
			this.sprites.remove(this.hint);
			this.hint.removeEventListener('hidden', this.hiddenHandler);
			this.hint = null;
		}
		if (this.ahaTimer) {
			clearTimeout(this.ahaTimer);
			this.ahaTimer = null;
		}
	}

	addSprite(position, data, imagePath, scale) {
		if (imagePath) {
			this.level.addResource(imagePath);
		}
		const state = {
			position: position.toArray(),
			image: (imagePath) ? {
				scale: scale,
				path: imagePath
			} : null,
			strategy: STRATEGY_HINT,
			data: data,
			type: SPRITE_TYPE_HINT
		};
		const sprite = new SpriteModel(state);
		this.sprites.add(sprite);
		sprite.isPersistent = false;
		return sprite;
	}

}
