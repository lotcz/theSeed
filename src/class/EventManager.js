export default class EventManager {
	handlers;

	constructor() {
		this.handlers = [];
	}

	addEventListener(eventName, eventHandler) {
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		return this.handlers[eventName].push(eventHandler);
	}

	removeEventListener(eventName, eventHandler) {
		const index = this.handlers.indexOf(eventHandler);
		if (index >= 0) {
			this.handlers.splice(index, 1);
		}
	}

	triggerEvent(eventName, sender, param) {
		if (!this.handlers[eventName]) {
			return;
		}
		const handlers = this.handlers[eventName];
		handlers.forEach((item) => {
			item(sender, param);
		});
	}

}
