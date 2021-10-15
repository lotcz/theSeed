import SvgRenderer from "./SvgRenderer";
import PlantRenderer from "./PlantRenderer";
import BeeRenderer from "./BeeRenderer";
import {GROUND_DARK, GROUND_LIGHT} from "./Palette";
import GroundRenderer from "./GroundRenderer";

import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import ParallaxRenderer from "./ParallaxRenderer";
import Vector2 from "../class/Vector2";
import InventoryRenderer from "./InventoryRenderer";
import ResourceLoader from "../class/ResourceLoader";
import CollectionModel from "../model/CollectionModel";

export const HIDE_WHEN_OUTTA_SIGHT = false;

const DEBUG_LEVEL_RENDERER = false;

export default class LevelRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.group = this.draw.group();
		this.group.addClass('level');

		this.background = this.group.group().addClass('background');

		// GROUND
		this.ground = this.group.group().addClass('ground');
		this.groundRenderer = new GroundRenderer(this.game, this.model.ground, this.ground);
		this.addChild(this.groundRenderer);

		// FOREGROUND
		this.foreground = this.group.group().addClass('foreground');
		this.plantRenderer = new PlantRenderer(this.game, this.model.plant, this.foreground);
		this.addChild(this.plantRenderer);

		// PARALLAX
		this.parallaxRenderer = new ParallaxRenderer(this.game, this.model.parallax, this.background, this.foreground);
		this.addChild(this.parallaxRenderer);

		// SPRITES
		this.sprites = this.group.group().addClass('sprites');
		this.spritesRenderer = new SpriteCollectionRenderer(this.game, this.model.sprites, this.sprites);
		this.addChild(this.spritesRenderer);

		// INVENTORY
		/*
		if (this.model.inventory) {
			this.inventory = this.group.group().addClass('inventory');
			this.inventoryRenderer = new InventoryRenderer(this.game, this.model.inventory, this.inventory);
			this.addChild(this.inventoryRenderer);
		}
		*/
		//Bee
		if (this.model.bee) {
			this.beeRenderer = new BeeRenderer(this.game, this.model.bee, this.group);
			this.addChild(this.beeRenderer);
		}

		this.model.resources.addOnAddListener((sender, resource) => this.onAddResource(resource));
	}

	deactivateInternal() {
		if (this.group) this.group.remove();
	}

	renderInternal() {
		if (this.model.viewBoxSize.isDirty() || this.model.viewBoxCoordinates.isDirty() || this.model.viewBoxScale.isDirty()) {
			if (HIDE_WHEN_OUTTA_SIGHT) {
				this.spritesRenderer.updateOuttaSight();
			}
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.draw.viewbox(
				this.model.viewBoxCoordinates.x,
				this.model.viewBoxCoordinates.y,
				this.model.viewBoxSize.x * this.model.viewBoxScale.get(),
				this.model.viewBoxSize.y * this.model.viewBoxScale.get()
			);
			this.model.viewBoxCoordinates.clean();
			this.model.viewBoxScale.clean();
		}
	}

	onAddResource(resource) {
		if (DEBUG_LEVEL_RENDERER) console.log('Resource added.', resource);
		const loader = new ResourceLoader(this.draw, resource);
		loader.load((r) => {
			if (DEBUG_LEVEL_RENDERER) console.log('Resource loaded', r);
		});
	}

}
