import Tree from "./Tree";
import ResourceLoader from "./ResourceLoader";

export default class ResourcesLoader extends Tree {
	onLoaded;

	constructor(resources, draw, uris) {
		super();

		this.draw = draw;
		uris.forEach((uri) => this.addChild(new ResourceLoader(resources, draw, uri)));
		this.onLoaded = null;
	}

	update() {
		if (this.isLoaded()) {
			this.onLoaded();
		}
	}

	isLoaded() {
		return this.children.every((ch) => ch.isLoaded());
	}

	load(onLoaded) {
		this.onLoaded = onLoaded;
		this.children.forEach((ch) => ch.load(() => this.update()));
	}

}
