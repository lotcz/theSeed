import SvgRenderer from "./SvgRenderer";
import PlantRenderer from "./PlantRenderer";
import ImageRenderer from "./ImageRenderer";
import {BROWN_DARK, BROWN_LIGHT, GROUND_DARK, GROUND_LIGHT, SKY_DARK, SKY_LIGHT} from "./Palette";
import GroundRenderer from "./GroundRenderer";
import Vector2 from "../class/Vector2";
import RockImage from '../../res/img/rock2.svg';
import HillImage from '../../res/img/hill.svg';
import EggHillsImage from '../../res/img/egghills.svg';
import StalkImage from '../../res/img/stalk.svg';
import * as dat from 'dat.gui';
import Stats from "../class/stats.module";

const DEBUG_FPS = true;
const PARALLAX_SIZE = 10;

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

		// parallax
		this.parallax = this.draw.group();
		//this.parallax.opacity(0.5);
		/*
		this.parallax.filterWith(function(add) {
			add.gaussianBlur(30)
		})
		*/

		/*
		// SEPIA
		this.parallax.filterWith(function(add) {
			add.colorMatrix('matrix', [ .343, .669, .119, 0, 0
				, .249, .626, .130, 0, 0
				, .172, .334, .111, 0, 0
				, .000, .000, .000, 1, 0 ])
		});
*/

		// SEPIA
		this.parallax.filterWith(function(add) {
			add.colorMatrix('matrix',
				[ 0, 0, 1, 0, 0
				, 0, 0, 1, 0, 0
				, 0, 0, 1, 0, 0
				, .000, .000, .000, 1, 0 ])
		});

		/*
		// COLORIZE
		this.parallax.filterWith(function(add) {
			add.colorMatrix('matrix', [ 1.0, 0,   0,   0,   0
				, 0,   0.2, 0,   0,   0
				, 0,   0,   0.2, 0,   0
				, 0,   0,   0,   1.0, 0 ])
		});
*/

		this.parallaxLayers = [];
		const height = this.model.grid.getMaxCoordinates().y;
		const width = this.model.grid.getMaxCoordinates().x;

		const layers = new Array(PARALLAX_SIZE + 1);

		layers[PARALLAX_SIZE] = RockImage;
		layers[9] = EggHillsImage;
		layers[8] = HillImage;
		layers[7] = StalkImage

		for (let i = PARALLAX_SIZE; i >= 0; i-- ) {
			const layer = layers[i];
			if (!layer) continue;

			const fullWidth = width * (0.2 + ( i / PARALLAX_SIZE));
			const group = this.parallax.group();
			const img = group.image(
				layer,
				function(e) {
					img.scale(fullWidth / img.width());
					img.move(width / 2, height / 2);
				}
			);

			this.parallaxLayers[i] = group;
		}

		this.ground = this.draw.group();
		this.groundRenderer = new GroundRenderer(this.ground, model.ground, model.grid, groundGradient, { width: 4, color: GROUND_DARK});
		this.addChild(this.groundRenderer);

		this.foreground = this.draw.group();
		this.plantRenderer = new PlantRenderer(this.foreground, model.plant, model.grid);
		this.addChild(this.plantRenderer);
		this.butterflyRenderer = new ImageRenderer(this.foreground, model.butterfly, model.grid);
		this.addChild(this.butterflyRenderer);
		this.ladybugRenderer = new ImageRenderer(this.foreground, model.ladybug, model.grid);
		this.addChild(this.ladybugRenderer);
		this.bug1Renderer = new ImageRenderer(this.foreground, model.bug1, model.grid);
		this.addChild(this.bug1Renderer);
		this.beetleRenderer = new ImageRenderer(this.foreground, model.beetle, model.grid);
		this.addChild(this.beetleRenderer);
		this.coccinelleRenderer = new ImageRenderer(this.foreground, model.coccinelle, model.grid);
		this.addChild(this.coccinelleRenderer);


		// UI

		//this.gui = new dat.GUI();

		if (DEBUG_FPS) {
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
		}

	}

	renderParallax() {
		const cameraCoordinates = new Vector2(
			this.model.viewBoxCoordinates.x + (0.5 * this.model.viewBoxSize.x * this.model.viewBoxScale.get()),
			this.model.viewBoxCoordinates.y + (0.5 * this.model.viewBoxSize.y * this.model.viewBoxScale.get())
		);
		const center = this.model.grid.getMaxCoordinates().multiply(0.5);
		const cameraOffset = cameraCoordinates.subtract(center);

		for (let i = 0, max = PARALLAX_SIZE; i <= max; i++) {
			if (this.parallaxLayers[i]) {
				const layerOffset = cameraOffset.multiply((i / PARALLAX_SIZE));
				const layerCenter = center.add(layerOffset);
				this.parallaxLayers[i].center(layerCenter.x, layerCenter.y);
			}
		}
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
		if (this.model.viewBoxSize.isDirty() || this.model.viewBoxCoordinates.isDirty() || this.model.viewBoxScale.isDirty()) {
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.draw.viewbox(
				this.model.viewBoxCoordinates.x,
				this.model.viewBoxCoordinates.y,
				this.model.viewBoxSize.x * this.model.viewBoxScale.get(),
				this.model.viewBoxSize.y * this.model.viewBoxScale.get()
			);
			this.renderParallax();
			this.model.viewBoxSize.clean();
			this.model.viewBoxCoordinates.clean();
			this.model.viewBoxScale.clean();
		}
		if (this.model.highlightedTilePosition.isDirty()) {
			if (this.highlightedTiles) this.highlightedTiles.remove();
			this.highlightedTiles = this.draw.group();
			this.renderHighlights(this.model.highlightedTilePosition);
			this.model.highlightedTilePosition.clean();
		}

		if (DEBUG_FPS) {
			this.stats.update();
		}
	}

}
