import Tree from "./Tree";
import ResourceModel, {RESOURCE_TYPE_GROUP, RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
import Pixies from "./Pixies";

export default class ResourceLoader extends Tree {
	model;
	loaded;
	onLoaded;
	resource;
	draw;

	constructor(draw, model) {
		super();

		this.draw = draw;
		this.model = model;
		this.model.children.forEach((ch) => this.addChild(new ResourceLoader(draw, ch)));

		this.loaded = false;
		this.onLoaded = null;
		this.resource = null;

	}

	update() {
		if (this.isLoaded()) {
			this.onLoaded();
		}
	}

	isLoaded() {
		if (!this.loaded) return false;
		return this.children.every((ch) => ch.isLoaded());
	}

	loadInternal() {
		switch (this.model.resType) {
			case RESOURCE_TYPE_GROUP:
				this.loaded = true;
				break;
			case RESOURCE_TYPE_IMAGE:
				const defs = this.draw.root().defs();
				const token = Pixies.token(this.model.uri);
				this.resource = defs.findOne('#' + token);
				if (!this.resource) {
					this.resource = defs.image(
						this.model.data,
						() => {
							this.loaded = true;
							this.update();
						}
					);
					this.resource.attr({id:token});
					//defs.add(this.resource);
				} else {
					this.loaded = true;
				}
				break;
		}
		this.update();
	}

	load(onLoaded) {
		this.onLoaded = onLoaded;
		this.loadInternal();
		this.children.forEach((ch) => ch.load(() => this.update()));
	}

}
