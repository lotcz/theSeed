const BUG_TIMEOUT = 500;

export default class BugController {
	controls;
	model;
	ground;
	direction;
	gi;

	constructor(grid, ground, controls, model) {
		this.controls = controls;
		this.model = model;
		this.ground = ground;
		this.grid = grid;
		this.moveBug(Math.round(ground.points.length / 3));
		this.timeout = BUG_TIMEOUT;
		this.direction = 1;
		this.target = this.gi + this.direction;
	}

	moveBug(gi) {
		this.gi = gi;
		this.model.position.set(this.ground.points[this.gi]);
	}

	update(delta) {
		if (this.timeout <= 0) {
			const old = this.direction;
			this.gi = this.target;
			this.direction = ((Math.random() > 0.9) ? -this.direction : this.direction);
			if (old !== this.direction) {
				this.model.flipped.set(!this.model.flipped.get());
			}
			this.target = Math.max(0, Math.min(this.ground.points.length-1, this.gi + this.direction));
			this.timeout = BUG_TIMEOUT;
		}

		this.timeout -= delta;

		const progress = (BUG_TIMEOUT - this.timeout) / BUG_TIMEOUT;
		const a = this.grid.getCoordinates(this.ground.points[this.gi]);
		const b = this.grid.getCoordinates(this.ground.points[this.target]);

		const v = a.add(b.subtract(a).multiply(progress));

		this.model.coordinates.set(v);


	}

}
