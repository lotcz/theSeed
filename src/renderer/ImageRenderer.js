import SvgRenderer from "./SvgRenderer";

const DEBUG_IMAGE = false;

export default class ImageRenderer extends SvgRenderer {
	group;
	image;
	lastRotation;
	grid;
	constructor(game, model, draw) {
		super(game, model, draw);

		this.grid = game.level.grid;
		this.lastRotation = 0;
	}

	activateInternal() {
		if (this.isActivated())	this.deactivateInternal();
		this.group =  this.draw.group();
		const ref = this.getRef(this.model.path);
		this.image = this.group.use(ref);
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

	renderInternal() {
		if (this.model.position.isDirty()) {
			this.model.coordinates.set(this.grid.getCoordinates(this.model.position));
			this.model.position.clean();
		}
		if (this.model.scale.isDirty()) {
			this.image.scale(this.model.scale.get());
			this.model.scale.clean();
			this.model.coordinates.makeDirty();
		}
		if (this.model.coordinates.isDirty()) {
			if (!(this.model.coordinates.x > 0)) {
				console.log(this.model);
			}
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

}
