import DomRenderer from "./DomRenderer";
import BeeLifeImage from "../../res/img/bee-life.svg";
import {MAX_HEALTH} from "../model/BeeStateModel";
import {
	GREEN_DARKEST,
	GREEN_LIGHT,
	ORANGE_DARK,
	ORANGE_DARKEST, ORANGE_LIGHT, ORANGE_MEDIUM,
	RED_DARK,
	RED_LIGHT,
	RED_MEDIUM
} from "../builder/Palette";

const HEALTH_COLORS = [
	{
		maxHealth: 0.25,
		color: RED_LIGHT,
		borderColor: RED_MEDIUM
	},
	{
		maxHealth: 0.5,
		color: ORANGE_MEDIUM,
		borderColor: ORANGE_DARKEST
	},
	{
		maxHealth: MAX_HEALTH,
		color: GREEN_LIGHT,
		borderColor: GREEN_DARKEST
	}
];

export default class BeeStateRenderer extends DomRenderer {
	mainElement;
	livesElement;
	healthElement;
	healthWrapperElement;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.mainElement = null;
		this.livesElement = null;
		this.healthElement = null;
		this.healthWrapperElement = null;
	}

	activateInternal() {
		this.mainElement = this.createElement(this.dom, 'div', ['menu', 'status-bar']);
		this.livesElement = this.createElement(this.mainElement, 'div', ['lives']);
		this.healthWrapperElement = this.createElement(this.mainElement, 'div', ['health-wrapper']);
		this.healthElement =  this.createElement(this.healthWrapperElement, 'div', ['health']);

		this.renderLives();
		this.renderHealth();
	}

	deactivateInternal() {
		if (this.mainElement) this.removeElement(this.mainElement);
		this.mainElement = null;
	}

	renderInternal() {
		if (this.model.lives.isDirty() || this.model.maxLives.isDirty()) {
			this.renderLives();
			this.model.lives.clean();
			this.model.maxLives.clean();
		}
		if (this.model.health.isDirty()) {
			this.renderHealth();
			this.model.health.clean();
		}
		this.model.clean();
	}

	renderLives() {
		this.livesElement.innerHTML = '';
		const max = this.model.maxLives.get();
		for (let i = 0; i < max; i++) {
			const img = this.createElement(this.livesElement, 'img', i < this.model.lives.get() ? 'unused' : 'used');
			img.src = BeeLifeImage;
		}
	}

	renderHealth() {
		const health = this.model.health.get();
		const state = 100 * health / MAX_HEALTH;
		this.healthElement.style.width = `${state}%`;

		let i = 0;
		const len = HEALTH_COLORS.length - 1;
		while (i < len && health > HEALTH_COLORS[i].maxHealth) {
			i++;
		}
		this.healthElement.style.backgroundColor = HEALTH_COLORS[i].color;
		this.healthWrapperElement.style.borderColor = HEALTH_COLORS[i].borderColor;
	}

}
