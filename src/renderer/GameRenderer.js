import SvgRenderer from "./SvgRenderer";
import RootsRenderer from "./RootsRenderer";
import PlantRenderer from "./PlantRenderer";

export default class GameRenderer extends SvgRenderer {
	ui;
	highlightedTile;

	constructor(draw, model) {
		super(draw, model);
		this.highlightedTile = null;
		this.plantRenderer = new PlantRenderer(draw, model.plant, model.grid);
		this.addChild(this.plantRenderer);
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
			if (this.highlightedTile) this.highlightedTile.remove();
			const box = this.model.grid.getBox(this.model.highlightedTilePosition);
			this.highlightedTile = this.draw.rect(box.w, box.h).move(box.x, box.y).fill('transparent').stroke({ width: 2, color: 'blue'});
			this.model.highlightedTilePosition.clean();
		}
	}

}
