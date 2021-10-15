import Tree from "./Tree";
import ResourceModel, {RESOURCE_TYPE_GROUP, RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
import Pixies from "./Pixies";

const DEBUG_RESOURCE_LOADER = false;

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

		this.loaded = false;
		this.onLoaded = null;
		this.resource = null;

	}

	update() {
		if (this.isLoaded()) {
			this.onLoaded(this.resource);
		}
	}

	isLoaded() {
		return this.loaded;
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
					if (DEBUG_RESOURCE_LOADER) console.log(`Resource ${this.model.uri} already loaded.`);
					this.loaded = true;
				}
				break;
		}
		this.update();
	}

	load(onLoaded) {
		this.onLoaded = onLoaded;
		this.loadInternal();
	}

}
