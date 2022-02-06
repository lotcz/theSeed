import UpdatedStrategy from "../UpdatedStrategy";
import {STRATEGY_DOOR_MOUTH} from "../../../builder/sprites/SpriteStyleBasic";

const MOUTH_TRIGGER_TIMEOUT = 1000;
const MOUTH_TRIGGER_CLOSE_TIMEOUT = 500;
const MOUTH_TRIGGER_DEFAULT_SIZE  = 2;

export default class MouthTriggerStrategy extends UpdatedStrategy {
	size;
	noticeDistance;
	closeDistance;

	/**
	 * @param {GameModel} game
	 * @param {SpriteModel} model
	 * @param {ControlsModel} controls
	 */
	constructor(game, model, controls) {
		super(game, model, controls, MOUTH_TRIGGER_TIMEOUT);

		if (!this.model.data.size) {
			this.model.data.size = this.model.data.size || MOUTH_TRIGGER_DEFAULT_SIZE;
		}

		this.closeDistance = this.grid.tileRadius.get() * (this.model.data.size - 1) * 2;
		this.noticeDistance = this.closeDistance * 3;
		this.centerCoordinates = this.grid.getCoordinates(this.model.position);
		this.affectedPositions = this.grid.getAffectedPositions(this.model.position, this.model.data.size);
	}

	updateStrategy() {
		if (this.level.isPlayable && this.level.bee) {
			const distance = this.level.bee.coordinates.distanceTo(this.centerCoordinates);
			if (distance < this.noticeDistance) {
				this.defaultTimeout = MOUTH_TRIGGER_CLOSE_TIMEOUT;
				if (distance < this.closeDistance) {
					this.close();
				}
			} else {
				this.defaultTimeout = MOUTH_TRIGGER_TIMEOUT;
				this.open();
			}
		}
	}

	sendSignal(open) {
		const mouths = this.chessboard.getVisitorsMultiple(this.affectedPositions, (v) => v._is_sprite && v.strategy.equalsTo(STRATEGY_DOOR_MOUTH));
		mouths.forEach((m) => {
			if (m.data) {
				if (m.data.isOpen !== open) {
					m.triggerEvent('door-open-signal', open);
				}
			}
		});
	}

	open() {
		this.sendSignal(true);
	}

	close() {
		this.sendSignal(false);
	}

}
