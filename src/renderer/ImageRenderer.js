import SvgRenderer from "./SvgRenderer";
import ResourceLoader from "../class/ResourceLoader";
import LevelRenderer from "./LevelRenderer";

export default class ImageRenderer extends SvgRenderer {
	group;
	image;
	lastRotation;
	lastScale;
	flipped;
	onClick;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.flipped = false;
		this.lastRotation = 0;
		this.lastScale = 1;
	}

	activateInternal() {
		if (this.isActivated())	this.deactivateInternal();
		this.group = this.draw.group();
		const ref = this.getRef(this.model.path);
		this.image = this.group.use(ref);
		if (this.onClick) {
			this.setOnClick(this.onClick);
		}
		this.updateFromModel();
	}

	deactivateInternal() {
		if (this.group) {
			this.group.remove();
			this.group = null;
		}
		this.lastRotation = 0;
		this.lastScale = 1;
	}

	updateScale() {
		const scale = this.model.scale.get() / this.lastScale;
		this.lastScale = this.model.scale.get();
		this.model.scale.clean();
		this.image.scale(scale);
		this.model.coordinates.makeDirty();
		this.updateCoordinates();
	}

	updateCoordinates() {
		this.group.center(
			this.model.coordinates.x,
			this.model.coordinates.y
		);
		this.model.coordinates.clean();
	}

	updateFlip() {
		if (this.model.flipped.get() && !this.flipped) {
			this.image.flip('x');
			this.flipped = true;
		}
		if (this.flipped && !this.model.flipped.get()) {
 			this.image.flip('x');
 			this.flipped = false;
 		}
		this.model.flipped.clean();
	}

	updateRotation() {
		this.image.rotate(-this.lastRotation);
		this.lastRotation = this.model.rotation.get();
		this.image.rotate(this.lastRotation);
		this.model.rotation.clean();
	}

	updateSize() {
		/*
		if (this.model.size) {
			if (this.image && this.model.size.size() > 0) {
				this.image.size(this.model.size.x, this.model.size.y);
			}
		}
		*/
	}

	updateFromModel() {
		this.updateSize();
		this.updateScale();
		this.updateFlip();
		this.updateRotation();
	}

	renderInternal() {

		if (this.model.scale.isDirty()) {
			this.updateScale();
		}
		if (this.model.coordinates.isDirty()) {
			this.updateCoordinates();
		}
		if (this.model.flipped.isDirty()) {
			this.updateFlip();
		}
		if (this.model.rotation.isDirty()) {
			this.updateRotation();
		}
		if (this.model.size && this.model.size.isDirty()) {
			this.updateSize();
		}
	}

	setOnClick(onClick) {
		this.onClick = onClick;
		if (this.image) {
			this.image.on('click', onClick);
		}
	}

}
