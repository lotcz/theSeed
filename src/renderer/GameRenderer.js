import SvgRenderer from "./SvgRenderer";
import PlantRenderer from "./PlantRenderer";
import ButterflyRenderer from "./ButterflyRenderer";
import {BROWN_DARK, BROWN_LIGHT, GROUND_DARK, GROUND_LIGHT, SKY_DARK, SKY_LIGHT} from "./Palette";
import GroundRenderer from "./GroundRenderer";

export default class GameRenderer extends SvgRenderer {
	ui;
	highlightedTiles;

	constructor(draw, model) {
		super(draw, model);
		this.highlightedTiles = null;

		this.background = this.draw.group();
		const max = this.model.grid.getMaxCoordinates();
		const linear = draw.gradient('linear', function(add) {
			add.stop(0, SKY_LIGHT);
			add.stop(1, SKY_DARK);
			add.from(0, 0);
			add.to(0,1);
		})
		this.background.rect(max.x, max.y).fill(linear);
		this.background.back();

		const groundGradient = draw.gradient('linear', function(add) {
			add.stop(0, GROUND_LIGHT);
			add.stop(1, GROUND_DARK);
			add.from(0, 0);
			add.to(0,1);
		})
		this.groundRenderer = new GroundRenderer(this.background, model.ground, model.grid, groundGradient, { width: 4, color: BROWN_LIGHT});
		this.addChild(this.groundRenderer);

		this.foreground = this.draw.group();
		this.plantRenderer = new PlantRenderer(this.foreground, model.plant, model.grid);
		this.addChild(this.plantRenderer);
		this.butterflyRenderer = new ButterflyRenderer(this.foreground, model.butterfly, model.grid);
		this.addChild(this.butterflyRenderer);
	}

	renderGridTile(position, stroke) {
		const corners = this.model.grid
			.getCorners(position)
			.map((c) => [c.x, c.y]);
		corners.push(corners[0]);
		this.highlightedTiles.polyline(corners).fill('transparent').stroke(stroke);
	}

	renderHighlights(position) {
		this.renderGridTile(position, { width: 2, color: 'blue'});

		this.renderGridTile(this.model.grid.getNeighborUpperLeft(position), { width: 2, color: 'orange'});
		this.renderGridTile(this.model.grid.getNeighborUpperRight(position), { width: 2, color: 'red'});

		this.renderGridTile(this.model.grid.getNeighborLowerLeft(position), { width: 2, color: 'magenta'});
		this.renderGridTile(this.model.grid.getNeighborLowerRight(position), { width: 2, color: 'cyan'});

		this.renderGridTile(this.model.grid.getNeighborDown(position), { width: 2, color: 'lightgreen'});
		this.renderGridTile(this.model.grid.getNeighborUp(position), { width: 2, color: 'darkgreen'});
	}

	renderInternal() {
		if (this.model.viewBoxSize.isDirty() || this.model.viewBoxPosition.isDirty() || this.model.viewBoxScale.isDirty()) {
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.draw.viewbox(this.model.viewBoxPosition.x, this.model.viewBoxPosition.y, this.model.viewBoxSize.x * this.model.viewBoxScale.get(), this.model.viewBoxSize.y * this.model.viewBoxScale.get());
			this.model.viewBoxSize.clean();
			this.model.viewBoxPosition.clean();
			this.model.viewBoxScale.clean();
		}
		if (this.model.highlightedTilePosition.isDirty()) {
			if (this.highlightedTiles) this.highlightedTiles.remove();
			this.highlightedTiles = this.draw.group();
			this.renderHighlights(this.model.highlightedTilePosition);
			this.model.highlightedTilePosition.clean();
		}

	}

}
