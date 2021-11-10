import MovementStrategy from "../MovementStrategy";
import UpdatedStrategy from "../UpdatedStrategy";

const DOOR_TIMEOUT = 2000;

export default class DoorSlotStrategy extends UpdatedStrategy {
	isOpen;

	constructor(game, model, controls) {
		super(game, model, controls, DOOR_TIMEOUT);

		this.isOpen = false;
	}

	updateStrategy() {
		if (this.isOpen) {
			return;
		}
		const visitors = this.chessboard.getVisitors(this.model.position, (v) => v._is_sprite && v.type === this.model.data.key);
		if (visitors.length > 0) {
			const affected = this.grid.getAffectedPositions(this.model.position, this.model.data.size);
			affected.forEach(
				(position) => {
					const door = this.chessboard.getVisitors(position, (v) => v._is_ground && v.type === this.model.data.door);
					door.forEach((d) => this.level.ground.removeTile(d));
				}
			);
			this.isOpen = true;
		}
	}

}
