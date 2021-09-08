import SvgRenderer from "./SvgRenderer";

const DEBUG_IMAGE = false;
const HIDE_WHEN_OUTTA_SIGHT = true;

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
		if (this.model.flipped.get()) {
			this.image.flip('x');
		}
		this.model.flipped.clean();
	}

	deactivateInternal() {
		if (this.group) {
			this.group.remove();
		}
	}

	render() {
		if (this.model.isDeleted()) {
			this.setDeleted(true);
			return;
		}

		if (!this.isActivated()) {
			return;
		}

		if (this.isDirty() || this.model.isDirty()) {
			if (HIDE_WHEN_OUTTA_SIGHT) {
				if (this.game.level.isCoordinateInView(this.model.coordinates)) {
					if (!this.group.visible()) {
						this.group.addTo(this.draw);
					}
					this.renderInternal();
					this.clean();
					this.model.clean();
				} else {
					if (this.group.visible()) {
						this.group.remove();
					}
				}
			} else {
				this.renderInternal();
				this.clean();
				this.model.clean();
			}
		}
	}

	renderInternal() {
		if (this.model.scale.isDirty()) {
			const scale = this.model.scale.get() / this.lastScale;
			this.lastScale = this.model.scale.get();
			this.model.scale.clean();
			this.image.scale(scale);
			this.model.coordinates.makeDirty();
		}
		if (this.model.coordinates.isDirty()) {
			this.group.center(
				this.model.coordinates.x,
				this.model.coordinates.y
			);
			if (DEBUG_IMAGE)
				this.draw.circle(14).center(this.model.coordinates.x, this.model.coordinates.y);
			this.model.coordinates.clean();
		}
		if (this.model.flipped.isDirty()) {
			this.image.flip('x');
			this.model.flipped.clean();
		}
		if (this.model.rotation.isDirty()) {
			this.image.rotate(-this.lastRotation);
			this.lastRotation = this.model.rotation.get();
			this.image.rotate(this.lastRotation);
			this.model.rotation.clean();
		}

	}

	setOnClick(onClick) {
		this.onClick = onClick;
		if (this.group) {
			this.group.on('click', onClick);
		}
	}

}
