import DomRenderer from "./DomRenderer";
import BeeLifeImage from "../../res/img/bee-life.svg";

export default class LivesRenderer extends DomRenderer {
	element;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.element = null;
	}

	activateInternal() {
		this.element = this.createElement(this.dom, 'div', ['menu', 'lives']);

		const img = this.createElement(this.element, 'img');
		img.src = BeeLifeImage;

		this.text = this.createElement(this.element, 'span');
	}

	deactivateInternal() {
		if (this.element) this.removeElement(this.element);
		this.element = null;
	}

	renderInternal() {
		const lives = this.model.get();
		this.text.innerHTML = lives;
		if (lives > 0) {
			this.removeClass(this.element, 'hidden');
		} else {
			this.addClass(this.element, 'hidden');
		}
	}

}
