import ModelBase from "../class/ModelBase";
import LevelModel from "./LevelModel";
import DirtyValue from "../class/DirtyValue";
import Vector2 from "../class/Vector2";
import LevelEditorModel from "./LevelEditorModel";
import HashTableModel from "./HashTableModel";
import ResourceModel, {RESOURCE_TYPE_IMAGE, RESOURCE_TYPE_SOUND} from "./ResourceModel";
import {PARALLAX_STYLES} from "../builder/ParallaxStyle";
import {
	IMAGE_BEE,
	IMAGE_BEE_CRAWL,
	IMAGE_BEE_DEAD,
	IMAGE_BEE_WING, IMAGE_HINT_BACKGROUND,
	IMAGE_STARS_1,
	IMAGE_STARS_2,
	IMAGE_STARS_3,
	SPRITE_STYLES
} from "../builder/SpriteStyle";

import BeeImage from "../../res/img/bee.svg";
import BeeDeadImage from "../../res/img/bee-dead.svg";
import BeeCrawlImage from "../../res/img/bee-walk.svg";
import BeeWingImage from "../../res/img/wing.svg";
import Stars1Image from "../../res/img/stars-1.svg";
import Stars2Image from "../../res/img/stars-2.svg";
import Stars3Image from "../../res/img/stars-3.svg";
import HintBackgroundImage from "../../res/img/hint-background.svg";
import {MUSIC_STYLES} from "../builder/MusicStyle";

export const DEBUG_MODE = true;

export default class GameModel extends ModelBase {
	id;
	level;
	levelName;
	lastLevelName;
	menu;
	editor;
	isInEditMode;
	viewBoxSize;
	resources;

	constructor() {
		super();

		this.id = Date.now();

		this.level = new DirtyValue();
		this.addChild(this.level);
		this.levelName = new DirtyValue();
		this.addChild(this.levelName);
		this.lastLevelName = null;

		this.menu = new DirtyValue();
		this.addChild(this.menu);

		this.editor = new LevelEditorModel();
		this.addChild(this.editor);
		this.isInEditMode = new DirtyValue(DEBUG_MODE);
		this.addChild(this.isInEditMode);

		this.viewBoxSize = new Vector2();
		this.addChild(this.viewBoxSize);

		this.resources = new HashTableModel();
		this.addChild(this.resources);
		this.initResources();
	}

	getState() {
		return {
			id: this.id,
			lastLevelName: this.lastLevelName,
			levelName: this.levelName.get(),
		}
	}

	restoreState(state) {
		if (state.id) this.id = state.id;
		if (state.lastLevelName) this.lastLevelName = state.lastLevelName;
		if (state.levelName) this.levelName.restoreState(state.levelName);
	}

	initResources() {
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE, BeeImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_DEAD, BeeDeadImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_CRAWL, BeeCrawlImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_BEE_WING, BeeWingImage);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_1, Stars1Image);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_2, Stars2Image);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_STARS_3, Stars3Image);
		this.addResource(RESOURCE_TYPE_IMAGE, IMAGE_HINT_BACKGROUND, HintBackgroundImage);

		for (let type in SPRITE_STYLES) {
			const style = SPRITE_STYLES[type];
			if (style.image) {
				this.addResource(RESOURCE_TYPE_IMAGE, style.image.uri, style.image.resource);
			}
		}

		for (let type in MUSIC_STYLES) {
			const style = MUSIC_STYLES[type];
			if (style.resource) {
				this.addResource(RESOURCE_TYPE_SOUND, style.url, style.resource);
			}
		}

		for (let type in PARALLAX_STYLES) {
			const style = PARALLAX_STYLES[type];
			if (style.layers) {
				style.layers.forEach((layer) => {
					if (layer.image) {
						this.addResource(RESOURCE_TYPE_IMAGE, layer.image.uri, layer.image.resource);
					}
				});
			}
		}
	}

	addResource(resType, uri, data) {
		if (this.resources.exists(uri)) {
			console.log(`Resource URI ${uri} already exists in game resources store.`);
		} else {
			this.resources.add(uri, new ResourceModel({type: resType, uri: uri, data: data}));
		}
	}

}

