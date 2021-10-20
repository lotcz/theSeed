import ControllerBase from "../class/ControllerBase";
import {NEIGHBOR_TYPE_DOWN} from "../model/GridModel";

const FALL_SPEED = 500; // pixels per second

export default class BeeDeathStrategy extends ControllerBase {

	activateInternal() {
		this.model.health.set(0);
		this.model.direction.set(0,0);
		this.speed = 0;
		this.parent.emptyInventory();
		this.model.image.path.set(this.model.deadImagePath.get());
	}

	updateInternal(delta) {
		if (this.level.isPenetrable(this.grid.getNeighbor(this.model.position, NEIGHBOR_TYPE_DOWN))) {
			this.model.coordinates.set(this.model.coordinates.addY((delta / 1000) * FALL_SPEED));
			this.model.position.set(this.grid.getPosition(this.model.coordinates));
		}
	}

}
