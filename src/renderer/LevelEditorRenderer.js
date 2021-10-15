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
import Pixies from "../class/Pixies";

const DEBUG_EDITOR = false;

export default class LevelEditorRenderer extends SvgRenderer {
	group;
	gui;
	toolsFolder;
	showGroundTilesController;
	brushController;
	toolTypeController;
	groundTiles;
	highlights;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.gui = null;
		this.toolsFolder = null;
		this.brushController = null;
		this.toolTypeController = null;
		this.showGroundTilesController = null;
		this.group = null;
		this.highlights = null;
		this.groundTiles = null;
		this.spriteHelpers = null;

		this.tileAddedHandler = (sender, tile) => this.groundTileAdded(tile);
		this.tileRemovedHandler = (sender, tile) => this.groundTileRemoved(tile);

		this.spriteAddedHandler = (sender, sprite) => this.spriteAdded(sprite);
		this.spriteRemovedHandler = (sender, sprite) => this.spriteRemoved(sprite);

		this.actions = {
			reload: () => this.reload(),
			saveAndReload: () => this.saveAndReload(),
			fitGrid: () => this.fitGrid(),
			download: () => this.downloadSavedGame()
		};

	}

	activateInternal() {
		this.deactivateInternal();

		const level = this.game.level.get();

		this.group = this.draw.group();
		this.group.addClass('level-editor');
		this.group.front();

		this.groundTiles = this.group.group().addClass('ground-tiles');
		this.spriteHelpers = this.group.group().addClass('sprite-helpers');
		this.highlights = this.group.group().addClass('highlights');

		this.gui = new dat.GUI();
		this.gui.add(level, 'name').listen()

		const levelFolder = this.gui.addFolder('Level');
		const gridFolder = levelFolder.addFolder('grid')
		gridFolder.add(this.grid, 'scale').listen();
		gridFolder.add(level.grid.size, 'x').listen();
		gridFolder.add(level.grid.size, 'y').listen();
		gridFolder.open();
		levelFolder.add(level.viewBoxScale, 'value', 0, 100).name('viewBoxScale').listen();

		const sizeFolder = levelFolder.addFolder('viewBoxSize')
		sizeFolder.add(this.level.viewBoxSize, 'x').listen();
		sizeFolder.add(this.level.viewBoxSize, 'y').listen();
		sizeFolder.open();
		const positionFolder = levelFolder.addFolder('viewBoxCoordinates')
		positionFolder.add(this.level.viewBoxCoordinates, 'x').listen();
		positionFolder.add(this.level.viewBoxCoordinates, 'y').listen();
		positionFolder.open();
		const parallaxFolder = levelFolder.addFolder('Parallax Camera Offset')
		parallaxFolder.add(this.level.parallax.cameraOffset, 'x').listen();
		parallaxFolder.add(this.level.parallax.cameraOffset, 'y').listen();
		parallaxFolder.open();

		this.toolsFolder = this.gui.addFolder('Tools');
		this.toolsFolder.add(this.model.selectedMode, 'value', this.model.modes).name('Mode')
			.onChange(() => {
					this.model.selectedMode.makeDirty();
				}
			);
		this.model.selectedMode.makeDirty();

		this.toolsFolder.add(this.model.showGroundTiles, 'value').name('Ground Tiles')
			.onChange(() => {
					this.model.showGroundTiles.makeDirty();
				}
			);
		this.toolsFolder.add(this.model.showSpriteHelpers, 'value').name('Sprite Helpers')
			.onChange(() => {
					this.model.showSpriteHelpers.makeDirty();
				}
			);
		this.brushController = this.toolsFolder.add(this.model, 'brushSize', this.model.brushSizes);

		this.toolsFolder.open();

		const moreFolder = this.gui.addFolder('More');
		const highlightFolder = moreFolder.addFolder('highlight');
		highlightFolder.add(this.model.highlightedTilePosition, 'x').listen();
		highlightFolder.add(this.model.highlightedTilePosition, 'y').listen();
		highlightFolder.open();

		const actionsFolder = this.gui.addFolder('Actions');
		actionsFolder.add(this.actions, 'reload').name('Reload');
		actionsFolder.add(this.actions, 'fitGrid').name('Fit Grid to Ground');
		actionsFolder.add(this.actions, 'download').name('Download');
		actionsFolder.add(this.actions, 'saveAndReload').name('Save & Reload');
		actionsFolder.open();

		this.gui.open();
	}

	deactivateInternal() {
		this.toolsFolder = null;
		if (this.group) {
			this.group.remove();
			this.group = null;
			this.groundTiles = null;
			this.highlights = null;
			this.spriteHelpers = null;
		}
		if (this.gui) {
			this.gui.destroy();
			this.gui = null;
		}
		if (this.highlightedTileDef) {
			this.highlightedTileDef.remove();
			this.highlightedTileDef = null;
		}
		this.hideHighlights();
	}

	getLevelState() {
		const state = this.game.level.get().getState();
		return JSON.stringify(state);
	}

	reload() {
		const level = this.game.level.get();
		this.model.levelLoadRequest.set(level.name);
	}

	saveGame() {
		const level = this.game.level.get();
		localStorage.setItem('beehive-savegame-' + level.name, this.getLevelState());
		console.log('Level saved.');
	}

	saveAndReload() {
		this.saveGame();
		this.reload();
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

	//<editor-fold desc="HIGHLIGHTS">

	hideHighlights() {
		if (this.highlights) {
			this.highlights.remove();
		}
		this.highlights = null;
	}

	renderHighlightedTile(position) {
		const level = this.game.level.get();
		const corners = level.grid
			.getCorners(position)
			.map((c) => [c.x, c.y]);
		corners.push(corners[0]);
		this.highlights.polyline(corners).fill('rgba(255, 255, 255, 0.3)');
	}

	renderHighlights() {
		this.hideHighlights();
		this.highlights = this.group.group();
		//const session = Pixies.startDebugSession('rendering');
		this.model.highlights.children.forEach((ch) => this.renderHighlightedTile(ch));
		//Pixies.finishDebugSession(session);
	}

	//</editor-fold>

	//<editor-fold desc="SPRITE HELPERS">

	renderSpriteHelper(position) {
		if (DEBUG_EDITOR) console.log('rendering sprite helper', position);

		const level = this.game.level.get();
		const visitors = level.grid.chessboard.getVisitors(position, (v) => v._is_sprite_helper === true);
		if (visitors.length === 0) {
			const helper = this.spriteHelpers.rect(level.grid.tileSize.x, level.grid.tileSize.y);
			helper.fill('transparent');
			helper.stroke({width: 6, color: 'white'});

			const coordinates = level.grid.getCoordinates(position);
			helper.center(coordinates.x, coordinates.y);
			level.grid.chessboard.addVisitor(position, {_is_sprite_helper: true, helper: helper});

		}
	}

	hideSpriteHelpers() {
		if (DEBUG_EDITOR) console.log('Hiding all sprite helpers');
		const level = this.game.level.get();
		level.sprites.removeOnAddListener(this.spriteAddedHandler);
		//level.sprites.removeOnRemoveListener(this.spriteRemovedHandler);
		this.spriteHelpers.hide();
	}

	showSpriteHelpers() {
		this.hideSpriteHelpers();
		const level = this.game.level.get();
		level.sprites.forEach((tile) => this.renderSpriteHelper(tile.position));
		this.spriteHelpers.show();
		level.sprites.addOnAddListener(this.spriteAddedHandler);
		level.sprites.addOnRemoveListener(this.spriteRemovedHandler);
	}

	spriteAdded(sprite) {
		this.renderSpriteHelper(sprite.position);
	}

	spriteRemoved(sprite) {
		this.destroyGroundTile(sprite.position);
	}

	//</editor-fold>

	//<editor-fold desc="TILES">

	renderGroundTile(position) {
		if (DEBUG_EDITOR) console.log('rendering tile position', position);

		const level = this.game.level.get();
		let tile;
		const visitors = level.grid.chessboard.getVisitors(position, (v) => v._is_hex === true);
		if (visitors.length === 0) {
			const hex = this.groundTiles.group();
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
			tile = hex;
		}
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

	hideGroundTiles() {
		if (DEBUG_EDITOR) console.log('Hiding all ground tiles');
		const level = this.game.level.get();
		level.ground.tiles.removeOnAddListener(this.tileAddedHandler);
		//level.ground.tiles.removeOnRemoveListener(this.tileRemovedHandler);
		this.groundTiles.hide();
	}

	showGroundTiles() {
		this.hideGroundTiles();
		this.level = this.game.level.get();
		this.level.ground.tiles.forEach((tile) => this.renderGroundTile(tile.position));
		this.groundTiles.show();
		this.level.ground.tiles.addOnAddListener(this.tileAddedHandler);
		this.level.ground.tiles.addOnRemoveListener(this.tileRemovedHandler);
	}

	groundTileAdded(tile) {
		this.renderGroundTile(tile.position);
	}

	groundTileRemoved(tile) {
		this.destroyGroundTile(tile.position);
	}

	//</editor-fold>

	fitGrid() {
		console.log('Fitting...');
		const level = this.game.level.get();
		const tiles = level.ground.tiles.children;

		if (tiles.length === 0) {
			console.log('No tiles to fit');
			return;
		}

		const min = tiles[0].position.clone();
		const max = tiles[0].position.clone();

		tiles.forEach((tile) => {
			const position = tile.position;
			min.x = Math.min(min.x, position.x);
			min.y = Math.min(min.y, position.y);
			max.x = Math.max(max.x, position.x);
			max.y = Math.max(max.y, position.y);
		});

		console.log(min, max);

		tiles.forEach((tile) => {
			tile.position.set(tile.position.subtract(min));
		});

		level.grid.size.set(max.subtract(min));
	}

	renderInternal() {
		if (DEBUG_EDITOR) console.log('Rendering editor');

		if (this.model.highlightedTilePosition.isDirty()) {
			this.renderHighlights();
			this.model.highlightedTilePosition.clean();
		}

		if (this.model.selectedMode.isDirty()) {
			if (this.toolTypeController) this.toolTypeController.remove();
			this.toolTypeController = null;

			switch (this.model.selectedMode.get()) {
				case EDITOR_MODE_GROUND:
					this.toolTypeController = this.toolsFolder.add(this.model, 'selectedGroundType', this.model.groundTypes);
					break;
				case EDITOR_MODE_SPRITES:
					this.toolTypeController = this.toolsFolder.add(this.model, 'selectedSpriteType', this.model.spriteTypes);
					break;
			}
			this.model.selectedMode.clean();
		}

		if (this.model.showGroundTiles.isDirty()) {
			if (this.model.showGroundTiles.get()) {
				this.showGroundTiles();
			} else {
				this.hideGroundTiles();
			}
			this.model.showGroundTiles.clean();
		}

		if (this.model.showSpriteHelpers.isDirty()) {
			if (this.model.showSpriteHelpers.get()) {
				this.showSpriteHelpers();
			} else {
				this.hideSpriteHelpers();
			}
			this.model.showSpriteHelpers.clean();
		}

	}

}
