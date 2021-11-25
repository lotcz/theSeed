import DomRenderer from "./DomRenderer";
import BeeLifeImage from "../../res/img/bee-life.svg";

export default class BeeStateRenderer extends DomRenderer {
	mainElement;
	livesElement;
	healthElement;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.mainElement = null;
		this.livesElement = null;
		this.healthElement = null;
	}

	activateInternal() {
		this.mainElement = this.createElement(this.dom, 'div', ['menu', 'status-bar']);
		this.livesElement = this.createElement(this.mainElement, 'div', ['lives']);
		this.healthElement = this.createElement(this.mainElement, 'progress', ['health']);
		this.healthElement.setAttribute('max', 1);
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
		this.healthElement.setAttribute('value', this.model.health.get());
	}

}
