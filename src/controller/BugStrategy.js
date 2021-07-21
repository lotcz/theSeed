import ControllerBase from "./ControllerBase";

const BUG_TIMEOUT = 500;

export default class BugStrategy extends ControllerBase {
	direction;
	gi;

	constructor(grid, model, controls) {
		super(grid, model, controls);

		this.moveBug(Math.floor(Math.random() * grid.ground.points.length));
		this.timeout = BUG_TIMEOUT;
		this.direction = 1;
		this.selectTarget();
	}

	selectTarget() {
		this.target = this.gi;
		if (Math.random() < 0.2) {
			this.direction = ((Math.random() < 0.1) ? -this.direction : this.direction);
			this.target = Math.max(0, Math.min(this.grid.ground.points.length - 1, this.gi + this.direction));
		}
	}

	moveBug(gi) {
		this.gi = gi;
		this.model.image.position.set(this.grid.ground.points[this.gi]);
	}

	update(delta) {
		if (this.timeout <= 0) {
			this.moveBug(this.target);
			this.selectTarget();
			this.timeout = BUG_TIMEOUT - delta;
			return;
		}

		this.timeout -= delta;

		if (this.gi !== this.target) {
			const progress = (BUG_TIMEOUT - this.timeout) / BUG_TIMEOUT;
			const a = this.grid.getCoordinates(this.grid.ground.points[this.gi]);
			const b = this.grid.getCoordinates(this.grid.ground.points[this.target]);

			const diff = b.subtract(a);
			const v = a.add(diff.multiply(progress));
			this.model.image.coordinates.set(v);
		}
/*
		const o = diff.multiply(-1);
		const sinX = o.y / o.size();
		const x = Math.asin(sinX);
		const angle = x * 180/Math.PI;
		this.model.image.rotation.set(angle);
*/

	}

}
