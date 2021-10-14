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

const DEBUG_EDITOR = false;

export default class LevelEditorRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.gui = null;
		this.toolsFolder = null;
		this.brushController = null;
		this.toolTypeController = null;
		this.group = null;
		this.groundTiles = [];

		this.tileAddedHandler = (sender, tile) => this.renderDebugGridTile(tile.position);
		this.tileRemovedHandler = (sender, tile) => this.hideGroundTile(tile.position);

		this.actions = {
			save: () => this.saveGame(),
			download: () => this.downloadSavedGame()
		};

	}

	activateInternal() {
		this.deactivateInternal();

		const level = this.game.level.get();

		this.group = this.draw.group();
		this.group.addClass('level-editor');
		this.group.front();

		this.gui = new dat.GUI();
		this.gui.add(level, 'name').listen()

		const gridFolder = this.gui.addFolder('grid')
		gridFolder.add(this.grid, 'scale').listen();
		const sizeFolder = gridFolder.addFolder('size')
		sizeFolder.add(level.grid.size, 'x').listen();
		sizeFolder.add(level.grid.size, 'y').listen();
		const scaleFolder = this.gui.addFolder('viewBoxScale')
		scaleFolder.add(level.viewBoxScale, 'value', 0, 100).listen();

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
		this.groundTiles.forEach((position) => this.destroyGroundTile(position));
		this.groundTiles = [];
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
		if (DEBUG_EDITOR) console.log('rendering tile position', position);

		const level = this.game.level.get();
		let tile;
		const visitors = level.grid.chessboard.getVisitors(position, (v) => v._is_hex === true);
		if (visitors.length === 0) {
			const hex = this.group.group();
			const corners = level.grid
				.getCorners(new Vector2())
				.map((c) => [c.x, c.y]);
			corners.push(corners[0]);
			hex.polyline(corners).fill('transparent').stroke({width: 2, color: '#fff'});
			hex.circle(20).fill('#000').center(-10, 0);
			hex.circle(20).fill('#fff').center(10, 0);
			const coordinates = level.grid.getCoordinates(position);
			hex.center(coordinates.x, coordinates.y);
			level.grid.chessboard.addVisitor(position, {_is_hex: true, hex: hex});
			this.groundTiles.push(position);
			tile = hex;
		} else {
			tile = visitors[0].hex;
		}
		tile.show();
	}

	destroyGroundTile(position) {
		const level = this.game.level.get();
		const visitors = level.grid.chessboard.getVisitors(position, (v) => v._is_hex === true);
		if (visitors.length > 1) {
			console.log('Visitors count more than 1', visitors);
		}
		if (visitors.length > 0) {
			const hex = visitors[0].hex;
			hex.remove();
			level.grid.chessboard.removeVisitor(position, visitors[0]);
		}
	}

	hideGroundTile(position) {
		const level = this.game.level.get();
		const visitors = level.grid.chessboard.getVisitors(position, (v) => v._is_hex === true);
		if (visitors.length > 1) {
			console.log('Visitors count more than 1', visitors);
		}
		if (visitors.length > 0) {
			const hex = visitors[0].hex;
			hex.hide();
		}
	}

	hideGroundTiles() {
		if (DEBUG_EDITOR) console.log('Hiding all ground tiles');
		this.level = this.game.level.get();
		this.level.ground.tiles.removeOnAddListener(this.tileAddedHandler);
		this.level.ground.tiles.removeOnRemoveListener(this.tileRemovedHandler);
		this.groundTiles.forEach((position) => this.hideGroundTile(position));
	}

	renderGroundTiles() {
		this.hideGroundTiles();
		this.level = this.game.level.get();
		this.level.ground.tiles.forEach((tile) => this.renderDebugGridTile(tile.position));
		this.level.ground.tiles.addOnAddListener(this.tileAddedHandler);
		this.level.ground.tiles.addOnRemoveListener(this.tileRemovedHandler);
	}

	renderInternal() {
		if (DEBUG_EDITOR) console.log('Rendering editor');

		if (this.toolTypeController) this.toolTypeController.remove();
		this.toolTypeController = null;

		if (this.brushController) this.brushController.remove();
		this.brushController = null;

		switch (this.model.selectedMode) {
			case EDITOR_MODE_GROUND:
				this.brushController = this.toolsFolder.add(this.model, 'brushSize', this.model.brushSizes);
				this.toolTypeController = this.toolsFolder.add(this.model, 'selectedGroundType', this.model.groundTypes);
				this.renderGroundTiles();
				break;
			case EDITOR_MODE_SPRITES:
				this.toolTypeController = this.toolsFolder.add(this.model, 'selectedSpriteType', this.model.spriteTypes);
				this.hideGroundTiles();
				break;
		}

	}

}
