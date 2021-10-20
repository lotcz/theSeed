import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";
import {BEE_CENTER} from "../controller/BeeController";
import AnimationRenderer from "./AnimationRenderer";

const DEBUG_BEE = true;

export default class BeeRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.group = this.draw.nested().addClass('bee');

		this.imageRenderer = new ImageRenderer(game, this.model.image, this.group);
		this.addChild(this.imageRenderer);

		this.crawlingAnimationRenderer = new AnimationRenderer(game, this.model.crawlingAnimation, this.group);
		this.addChild(this.crawlingAnimationRenderer);

		this.leftWingRenderer = new ImageRenderer(game, this.model.leftWing, this.group);
		this.addChild(this.leftWingRenderer);

		this.rightWingRenderer = new ImageRenderer(game, this.model.rightWing, this.group);
		this.addChild(this.rightWingRenderer);

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
		if (this.model.crawling.isDirty()) {
			this.updateBeeState();
			this.model.crawling.clean();
		}
		if (this.model.coordinates.isDirty()) {
			const coords = this.model.coordinates.subtract(BEE_CENTER);
			this.group.move(coords.x, coords.y);
			this.model.coordinates.clean();
		}
		if (this.model.image.flipped.isDirty()) {
			this.updateFlip();
		}

		if (DEBUG_BEE) this.helper.front();
	}

	updateFlip() {
		if (this.model.image.flipped.get()) {
			this.leftWingRenderer.group.back();
			this.rightWingRenderer.group.front();
		} else {
			this.leftWingRenderer.group.front();
			this.rightWingRenderer.group.back();
		}
	}

	updateBeeState() {
		if (this.model.isFlying()) {
			this.crawlingAnimationRenderer.deactivate();
			this.imageRenderer.activate();
		} else {
			this.crawlingAnimationRenderer.activate();
			this.imageRenderer.deactivate();
		}
		this.updateFlip();
	}

}
