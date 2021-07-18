import SvgRenderer from "./SvgRenderer";

export default class ImageRenderer extends SvgRenderer {
	grid;
	group;
	image;

	constructor(draw, model, grid) {
		super(draw, model);

		this.grid = grid;
		this.group =  this.draw.group();
		this.image = this.group.image(model.path);
		if (this.model.flipped.get()) {
			this.image.flip('x');
		}
		this.model.flipped.clean();
	}

	render() {
		if (this.model.position.isDirty()) {
			this.model.coordinates = this.grid.getCoordinates(this.model.position);
			this.model.position.clean()
		}
		if (this.model.coordinates.isDirty()) {
			this.group.move(this.model.coordinates.x - (this.image.width() / 2), this.model.coordinates.y - (this.image.height() / 2));
			//this.draw.circle(5).move(this.model.coordinates.x - (this.image.width() / 2), this.model.coordinates.y - (this.image.height() / 2));
			this.model.coordinates.clean()
		}
		if (this.model.flipped.isDirty()) {
			this.image.flip('x');
			this.model.flipped.clean()
		}
		if (this.model.rotation.isDirty()) {
			this.image.rotate(this.model.rotation.get());
			this.model.rotation.clean()
		}
		if (this.model.scale.isDirty()) {
			this.image.scale(this.model.scale.get());
			this.model.scale.clean();
		}
	}

}
