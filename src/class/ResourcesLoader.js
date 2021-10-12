import Tree from "./Tree";
import ResourceModel, {RESOURCE_TYPE_GROUP, RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
import Pixies from "./Pixies";
import ResourceLoader from "./ResourceLoader";

export default class ResourcesLoader extends Tree {
	collection;
	loaded;
	onLoaded;
	draw;

	constructor(draw, collection) {
		super();

		this.draw = draw;
		this.collection = collection;
		this.collection.forEach((ch) => this.addChild(new ResourceLoader(draw, ch)));

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
