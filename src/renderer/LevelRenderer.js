import SvgRenderer from "./SvgRenderer";
import PlantRenderer from "./PlantRenderer";
import {GROUND_DARK, GROUND_LIGHT} from "./Palette";
import GroundRenderer from "./GroundRenderer";

import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import ParallaxRenderer from "./ParallaxRenderer";
import Vector2 from "../class/Vector2";
import InventoryRenderer from "./InventoryRenderer";

export default class LevelRenderer extends SvgRenderer {

	constructor(game, model, draw) {
		super(game, model, draw);

		// PARALLAX
		this.parallax = draw.group();
		this.parallaxRenderer = new ParallaxRenderer(game, model.parallax, this.parallax);
		this.addChild(this.parallaxRenderer);

		// GROUND
		this.ground = this.draw.group();
		const groundGradient = draw.gradient('linear', function(add) {
			add.stop(0, GROUND_LIGHT);
			add.stop(1, GROUND_DARK);
			add.from(0, 0);
			add.to(0,1);
		})
		this.groundRenderer = new GroundRenderer(this.game, model.ground, this.ground, GROUND_LIGHT, { width: 4, color: GROUND_DARK});
		this.addChild(this.groundRenderer);

		// FOREGROUND
		this.foreground = this.draw.group();
		this.plantRenderer = new PlantRenderer(this.game, model.plant, this.foreground);
		this.addChild(this.plantRenderer);

		// SPRITES
		this.sprites = this.draw.group();
		this.spritesRenderer = new SpriteCollectionRenderer(this.game, model.sprites, this.sprites);
		this.addChild(this.spritesRenderer);

		// INVENTORY
		this.inventory = this.draw.group();
		this.inventoryRenderer = new InventoryRenderer(this.game, model.inventory, this.inventory);
		this.addChild(this.inventoryRenderer);
	}

	renderGridTile(position, stroke) {
		const corners = this.model.grid
			.getCorners(position)
			.map((c) => [c.x, c.y]);
		corners.push(corners[0]);
		this.highlightedTiles.polyline(corners).fill('transparent').stroke(stroke);
	}

	renderHighlights(position) {
		if (this.highlightedTiles) this.highlightedTiles.remove();
		this.highlightedTiles = this.draw.group();

		this.renderGridTile(position, { width: 2, color: 'blue'});

		this.renderGridTile(this.model.grid.getNeighborUpperLeft(position), { width: 2, color: 'orange'});
		this.renderGridTile(this.model.grid.getNeighborUpperRight(position), { width: 2, color: 'red'});

		this.renderGridTile(this.model.grid.getNeighborLowerLeft(position), { width: 2, color: 'magenta'});
		this.renderGridTile(this.model.grid.getNeighborLowerRight(position), { width: 2, color: 'cyan'});

		this.renderGridTile(this.model.grid.getNeighborDown(position), { width: 2, color: 'lightgreen'});
		this.renderGridTile(this.model.grid.getNeighborUp(position), { width: 2, color: 'darkgreen'});
	}

	renderInternal() {
		if (this.model.viewBoxSize.isDirty() || this.model.viewBoxCoordinates.isDirty() || this.model.viewBoxScale.isDirty()) {
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.draw.viewbox(
				this.model.viewBoxCoordinates.x,
				this.model.viewBoxCoordinates.y,
				this.model.viewBoxSize.x * this.model.viewBoxScale.get(),
				this.model.viewBoxSize.y * this.model.viewBoxScale.get()
			);
			const cameraCoordinates = new Vector2(
				this.model.viewBoxCoordinates.x + (0.5 * this.model.viewBoxSize.x * this.model.viewBoxScale.get()),
				this.model.viewBoxCoordinates.y + (0.5 * this.model.viewBoxSize.y * this.model.viewBoxScale.get())
			);
			const center = this.model.grid.getMaxCoordinates().multiply(0.5);
			const cameraOffset = cameraCoordinates.subtract(center);
			this.model.parallax.cameraOffset.set(cameraOffset);
			this.model.viewBoxCoordinates.clean();
			this.model.viewBoxScale.clean();
		}
		if (this.model.highlightedTilePosition.isDirty()) {
			this.renderHighlights(this.model.highlightedTilePosition);
			this.model.highlightedTilePosition.clean();
		}
	}

}
