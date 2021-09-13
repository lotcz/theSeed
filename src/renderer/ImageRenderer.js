import SvgRenderer from "./SvgRenderer";

export default class ImageRenderer extends SvgRenderer {
	group;
	image;
	lastRotation;
	lastScale;
	grid;
	onClick;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.grid = game.level.grid;
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
		if (this.model.flipped.get()) this.image.flip('x');
		this.model.flipped.clean();
	}

	updateRotation() {
		this.image.rotate(-this.lastRotation);
		this.lastRotation = this.model.rotation.get();
		this.image.rotate(this.lastRotation);
		this.model.rotation.clean();
	}

	updateFromModel() {
		this.updateScale();
		this.updateFlip();
		this.updateRotation()
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
	}

	setOnClick(onClick) {
		this.onClick = onClick;
		if (this.image) {
			this.image.on('click', onClick);
		}
	}

}
