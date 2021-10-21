import ControllerBase from "../class/ControllerBase";
import {NEIGHBOR_TYPE_DOWN, NEIGHBOR_TYPE_UP} from "../model/GridModel";

const FALL_SPEED = 400; // pixels per second

export default class BeeDeathStrategy extends ControllerBase {

	activateInternal() {
		this.model.health.set(0);
		this.model.direction.set(0,0);
		this.speed = 0;
		this.parent.emptyInventory();
		this.model.image.path.set(this.model.deadImagePath.get());
	}

	updateInternal(delta) {
		if (this.level.isWater(this.model.position)) {
			const coords = this.model.coordinates.addY(-(delta / 1000) * FALL_SPEED / 3);
			if (this.level.isWater(this.grid.getPosition(coords))) {
				this.model.coordinates.set(coords);
				this.model.position.set(this.grid.getPosition(this.model.coordinates));
				this.level.centerOnCoordinates(coords);
				this.level.sanitizeViewBox();
			}
			return;
		}
		if (this.level.isAir(this.model.position)) {
			this.model.coordinates.set(this.model.coordinates.addY((delta / 1000) * FALL_SPEED));
			this.model.position.set(this.grid.getPosition(this.model.coordinates));
		}

	}

}
