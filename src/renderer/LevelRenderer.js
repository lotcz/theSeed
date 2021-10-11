import SvgRenderer from "./SvgRenderer";
import PlantRenderer from "./PlantRenderer";
import BeeRenderer from "./BeeRenderer";
import {GROUND_DARK, GROUND_LIGHT} from "./Palette";
import GroundRenderer from "./GroundRenderer";

import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import ParallaxRenderer from "./ParallaxRenderer";
import Vector2 from "../class/Vector2";
import InventoryRenderer from "./InventoryRenderer";

export const HIDE_WHEN_OUTTA_SIGHT = true;
const DEBUG_HIGHLIGHTS = false;

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
		this.sprites =this.group.group().addClass('sprites');
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

	}

	renderGridTile(position, stroke) {
		const corners = this.model.grid
			.getCorners(position)
			.map((c) => [c.x, c.y]);
		corners.push(corners[0]);
		for (let i = 0, max = corners.length - 1; i < max; i++) {
			this.highlightedTiles.line(corners[i].concat(corners[i + 1])).stroke(stroke);
		}
	}

	renderHighlights(position) {
		if (this.highlightedTiles) this.highlightedTiles.remove();
		this.highlightedTiles = this.group.group();

		this.renderGridTile(position, { width: 2, color: 'blue'});

		if (DEBUG_HIGHLIGHTS) {
			this.renderGridTile(this.model.grid.getNeighborUpperLeft(position), {width: 2, color: 'orange'});
			this.renderGridTile(this.model.grid.getNeighborUpperRight(position), {width: 2, color: 'red'});

			this.renderGridTile(this.model.grid.getNeighborLowerLeft(position), {width: 2, color: 'magenta'});
			this.renderGridTile(this.model.grid.getNeighborLowerRight(position), {width: 2, color: 'cyan'});

			this.renderGridTile(this.model.grid.getNeighborDown(position), {width: 2, color: 'lightgreen'});
			this.renderGridTile(this.model.grid.getNeighborUp(position), {width: 2, color: 'darkgreen'});
		}
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
		if (this.model.highlightedTilePosition.isDirty()) {
			this.renderHighlights(this.model.highlightedTilePosition);
			this.model.highlightedTilePosition.clean();
		}
	}

}
