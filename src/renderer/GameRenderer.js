import SvgRenderer from "./SvgRenderer";
import PlantRenderer from "./PlantRenderer";
import Vector2 from "../class/Vector2";

export default class GameRenderer extends SvgRenderer {
	ui;
	highlightedTiles;

	constructor(draw, model) {
		super(draw, model);
		this.highlightedTiles = null;
		this.plantRenderer = new PlantRenderer(draw, model.plant, model.grid);
		this.addChild(this.plantRenderer);
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
