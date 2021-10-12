import SvgRenderer from "./SvgRenderer";
import PlantRenderer from "./PlantRenderer";
import BeeRenderer from "./BeeRenderer";
import {GROUND_DARK, GROUND_LIGHT} from "./Palette";
import GroundRenderer from "./GroundRenderer";

import SpriteCollectionRenderer from "./SpriteCollectionRenderer";
import ParallaxRenderer from "./ParallaxRenderer";
import Vector2 from "../class/Vector2";
import InventoryRenderer from "./InventoryRenderer";
import * as dat from "dat.gui";
import LevelModel from "../model/LevelModel";
import {EDITOR_MODE_GROUND, EDITOR_MODE_SPRITES} from "../model/LevelEditorModel";

const DEBUG_EDITOR = true;

export default class LevelEditorRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.gui = null;
		this.toolsFolder = null;
		this.brushController = null;
		this.toolTypeController = null;
		this.group = null;

		this.tilesChangedHandler = () => this.model.makeDirty();

		this.actions = {
			save: () => this.saveGame(),
			download: () => this.downloadSavedGame()
		};
	}

	activateInternal() {
		this.deactivateInternal();

		this.level = this.game.level.get();

		this.group = this.draw.group();
		this.group.addClass('level-editor');
		this.group.front();

		this.gui = new dat.GUI();
		this.gui.add(this.level, 'name').listen()

		const gridFolder = this.gui.addFolder('grid')
		gridFolder.add(this.grid, 'scale').listen();
		const gridsizeFolder = gridFolder.addFolder('size')
		gridsizeFolder.add(this.grid.size, 'x').listen();
		gridsizeFolder.add(this.grid.size, 'y').listen();
		const scaleFolder = this.gui.addFolder('viewBoxScale')
		scaleFolder.add(this.level.viewBoxScale, 'value', 0, 100).listen();

		/*
			const sizeFolder = this.gui.addFolder('viewBoxSize')
			sizeFolder.add(this.level.viewBoxSize, 'x').listen();
			sizeFolder.add(this.level.viewBoxSize, 'y').listen();
			const positionFolder = this.gui.addFolder('viewBoxCoordinates')
			positionFolder.add(this.level.viewBoxCoordinates, 'x').listen();
			positionFolder.add(this.level.viewBoxCoordinates, 'y').listen();
			const parallaxFolder = this.gui.addFolder('Parallax Camera Offset')
			parallaxFolder.add(this.level.parallax.cameraOffset, 'x').listen();
			parallaxFolder.add(this.level.parallax.cameraOffset, 'y').listen();
		*/

		this.gui.add(this.model, 'selectedMode', this.model.modes).onChange(() => this.model.makeDirty());

		this.toolsFolder = this.gui.addFolder('Tools');
		this.toolsFolder.open();

		this.gui.add(this.actions, 'save').name('Save');
		this.gui.open();
	}

	deactivateInternal() {
		this.toolsFolder = null;
		if (this.group) {
			this.group.remove();
			this.group = null;
		}
		if (this.gui) {
			this.gui.destroy();
			this.gui = null;
		}
	}

	getLevelState() {
		const state = this.game.level.get().getState();
		return JSON.stringify(state);
	}

	saveGame() {
		localStorage.setItem('beehive-savegame-' + this.game.level.get().name, this.getLevelState());
		console.log('Level saved.');
	}

	downloadSavedGame() {
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(this.getLevelState()));
		element.setAttribute('download', 'beehive-adventures-' + this.game.level.get().name + '.json');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	renderDebugGridTile(position) {
		this.level = this.game.level.get();
		const corners = this.level.grid
			.getCorners(position)
			.map((c) => [c.x, c.y]);
		corners.push(corners[0]);
		this.group.polyline(corners).fill('transparent').stroke({width: 2, color: '#fff'});
		const coordinates = this.level.grid.getCoordinates(position);
		this.group.circle(25).fill('red').center(coordinates.x, coordinates.y);
	}

	hideGroundTiles() {
		if (this.group) this.group.remove();
		this.level = this.game.level.get();
		this.group = null;
		if (this.level.ground.tiles) {
			this.level.ground.tiles.removeOnAddListener(this.tilesChangedHandler);
			this.level.ground.tiles.removeOnRemoveListener(this.tilesChangedHandler);
		}
	}

	renderGroundTiles() {
		this.hideGroundTiles();
		this.group = this.draw.group();
		this.group.addClass('level-editor');
		this.level = this.game.level.get();
		this.level.ground.tiles.forEach((tile) => this.renderDebugGridTile(tile.position));
		this.level.ground.tiles.addOnAddListener(this.tilesChangedHandler);
		this.level.ground.tiles.addOnRemoveListener(this.tilesChangedHandler);
	}

	renderInternal() {
		if (DEBUG_EDITOR) console.log('Rendering editor');

		if (this.toolTypeController) this.toolTypeController.remove();
		this.toolTypeController = null;

		if (this.brushController) this.brushController.remove();
		this.brushController = null;

		this.hideGroundTiles();

		switch (this.model.selectedMode) {
			case EDITOR_MODE_GROUND:
				this.brushController = this.toolsFolder.add(this.model, 'brushSize', this.model.brushSizes);
				this.toolTypeController = this.toolsFolder.add(this.model, 'selectedGroundType', this.model.groundTypes);
				this.renderGroundTiles();
				break;
			case EDITOR_MODE_SPRITES:
				this.toolTypeController = this.toolsFolder.add(this.model, 'selectedSpriteType', this.model.spriteTypes);
				break;
		}

	}

}
