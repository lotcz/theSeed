import ControllerBase from "./ControllerBase";

export default class BeeController extends ControllerBase {

	constructor(game, model, controls) {
		super(game, model, controls);

	}

	updateInternal(delta) {
		const position = this.model.image.position;
		if (this.controls.moveForward) {
			position.setY(position.y - 1);
		}
		if (this.controls.moveBackward) {
			position.setY(position.y + 1);
		}
		if (this.controls.moveLeft) {
			position.setX(position.x - 1);
		}
		if (this.controls.moveRight) {
			position.setX(position.x + 1);
		}
		if (this.model.image.position.isDirty()) {
			const coords = this.game.level.grid.getCoordinates(this.model.image.position);
			this.model.image.coordinates.set(coords);
			this.game.level.centerOnCoordinates(coords);
		}
	}

}
