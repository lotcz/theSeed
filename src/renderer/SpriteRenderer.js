import SvgRenderer from "./SvgRenderer";
import ImageRenderer from "./ImageRenderer";

export default class SpriteRenderer extends SvgRenderer {
	constructor(game, model, draw) {
		super(game, model, draw);

		this.attachedSpriteChangedHandler = () => this.updateAttachedSprite();
		this.attachedSpriteRenderer = null;
		this.imageRenderer = null;
	}

	activateInternal() {
		this.group = this.draw.group();
		this.imageRenderer = null;
		if (this.model.image) {
			this.imageRenderer = new ImageRenderer(this.game, this.model.image, this.group);
			this.addChild(this.imageRenderer);
			this.imageRenderer.activate();
			if (this.model.onClick) {
				this.imageRenderer.setOnClick(this.model.onClick);
			}
		}
		this.updateAttachedSprite();
		this.model.attachedSprite.addOnChangeListener(this.attachedSpriteChangedHandler);
	}

	deactivateInternal() {
		this.model.attachedSprite.removeOnChangeListener(this.attachedSpriteChangedHandler);
		if (this.group) {
			this.group.remove();
			this.group = null;
		}
	}

	updateAttachedSprite() {
		if (this.attachedSpriteRenderer) this.removeChild(this.attachedSpriteRenderer);
		if (this.model.attachedSprite.isSet()) {
			this.attachedSpriteRenderer = new SpriteRenderer(this.game, this.model.attachedSprite.get(), this.group);
			this.addChild(this.attachedSpriteRenderer);
			this.attachedSpriteRenderer.activate();
		}
	}

	updateOuttaSight() {
		if (!this.imageRenderer) return;

		if (!this.imageRenderer.isActivated()) {
			if (this.level.isCoordinateInView(this.model.image.coordinates)) {
				this.imageRenderer.activate();
			}
		} else if (this.imageRenderer.isActivated()) {
			if (!this.level.isCoordinateInView(this.model.image.coordinates)) {
				this.imageRenderer.deactivate();
			}
		}
	}

}
