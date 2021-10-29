import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import {BEE_CENTER} from "../controller/BeeController";
import AnimationRenderer from "./AnimationRenderer";
import SpriteCollectionRenderer from "./SpriteCollectionRenderer";

const DEBUG_BEE = false;

export default class BeeRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.dead = false;

		this.group = this.draw.nested().addClass('bee');

		this.imageRenderer = new ImageRenderer(game, this.model.image, this.group);
		this.addChild(this.imageRenderer);

		this.crawlingAnimationRenderer = new AnimationRenderer(game, this.model.crawlingAnimation, this.group);
		this.addChild(this.crawlingAnimationRenderer);

		this.starsAnimationRenderer = new AnimationRenderer(game, this.model.starsAnimation, this.group);
		this.addChild(this.starsAnimationRenderer);

		this.leftWingRenderer = new ImageRenderer(game, this.model.leftWing, this.group);
		this.addChild(this.leftWingRenderer);

		this.rightWingRenderer = new ImageRenderer(game, this.model.rightWing, this.group);
		this.addChild(this.rightWingRenderer);

		this.inventoryRenderer = new SpriteCollectionRenderer(game, this.model.inventory, this.group);
		this.addChild(this.inventoryRenderer);

		if (DEBUG_BEE) {
			this.helper = this.group.group();
			this.helper.circle(10).fill('red');
			this.helper.center(BEE_CENTER.x, BEE_CENTER.y);
		}
	}

	activateInternal() {
		this.updateFlip();
		this.updateBeeState();
	}

	renderInternal() {
		if (this.model.crawling.isDirty() || this.model.health.isDirty()) {
			this.updateBeeState();
			this.model.crawling.clean();
			this.model.health.clean();
		}
		if (this.model.coordinates.isDirty()) {
			const coords = this.model.coordinates.subtract(BEE_CENTER);
			this.group.move(coords.x, coords.y);
			this.model.coordinates.clean();
		}
		if (this.model.image.flipped.isDirty()) {
			this.updateFlip();
		}

		const isHurt = ((this.model.health.get() > 0) && (this.model.health.get() < 1));
		if (isHurt && !this.starsAnimationRenderer.isActivated()) {
			this.starsAnimationRenderer.activate();
		}
		if (this.starsAnimationRenderer.isActivated() && !isHurt) {
			this.starsAnimationRenderer.deactivate();
		}

		if (DEBUG_BEE) this.helper.front();
	}

	updateFlip() {
		if (this.model.isFlying()) {
			if (this.model.health.get() > 0) {
				if (this.model.image.flipped.get()) {
					this.leftWingRenderer.group.back();
					this.rightWingRenderer.group.front();
				} else {
					this.leftWingRenderer.group.front();
					this.rightWingRenderer.group.back();
				}
			}
		}
	}

	updateBeeState() {
		if (this.model.health.get() <= 0) {
			this.crawlingAnimationRenderer.deactivate();
			this.leftWingRenderer.deactivate();
			this.rightWingRenderer.deactivate();
			this.starsAnimationRenderer.deactivate();
		} else if (this.model.isFlying()) {
			this.crawlingAnimationRenderer.deactivate();
			this.imageRenderer.activate();
			this.leftWingRenderer.activate();
			this.rightWingRenderer.activate();
			this.updateFlip();
		} else {
			this.crawlingAnimationRenderer.activate();
			this.leftWingRenderer.deactivate();
			this.rightWingRenderer.deactivate();
			this.imageRenderer.deactivate();
		}

	}

}
