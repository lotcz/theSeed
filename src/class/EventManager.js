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
		if (!this.handlers[eventName]) {
			return;
		}
		tile.handlers.splice(this.handlers.indexOf(eventHandler), 1);
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
