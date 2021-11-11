import SvgRenderer from "./SvgRenderer";
import Vector2 from "../class/Vector2";
import * as dat from "dat.gui";
import * as localForage from "localforage";
import {EDITOR_MODE_GROUND, EDITOR_MODE_SPRITES} from "../model/LevelEditorModel";
import {SPRITE_STRATEGIES} from "../builder/SpriteStyle";

const DEBUG_EDITOR_RENDERER = false;
export const EDITOR_LEVEL_NAME_PREFIX = 'beehive-editor';

export default class LevelEditorRenderer extends SvgRenderer {
	group;
	gui;
	additionalGUI;
	toolsFolder;
	showGroundTilesController;
	brushController;
	toolTypeController;
	groundTiles;
	spriteHelpers;
	highlights;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.gui = null;
		this.additionalGUI = [];
		this.toolsFolder = null;
		this.brushController = null;
		this.toolTypeController = null;
		this.showGroundTilesController = null;

		this.group = null;
		this.highlights = null;
		this.groundTiles = null;
		this.spriteHelpers = null;

		this.tileAddedHandler = (tile) => this.groundTileAdded(tile);
		this.tileRemovedHandler = (tile) => this.groundTileRemoved(tile);

		this.spriteAddedHandler = (sprite) => this.spriteAdded(sprite);
		this.spriteRemovedHandler = (sprite) => this.spriteRemoved(sprite);

		this.actions = {
			reload: () => this.reload(),
			saveAndReload: () => this.saveAndReload(),
			fitGrid: () => this.fitGrid(),
			download: () => this.download()
		};

		if (DEBUG_EDITOR_RENDERER) console.log('Creating editor renderer');
	}

	activateInternal() {
		this.deactivateInternal();

		const level = this.game.level.get();
		if (!level) {
			console.log('No level to edit.');
			return;
		}

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
		gridFolder.add(level.grid.size, 'x').listen();
		gridFolder.add(level.grid.size, 'y').listen();
		gridFolder.add(level.grid.tileRadius, 'value').name('tileRadius').listen();
		gridFolder.open();
		const sizeFolder = levelFolder.addFolder('viewBoxSize')
		sizeFolder.add(level.viewBoxSize, 'x').listen();
		sizeFolder.add(level.viewBoxSize, 'y').listen();
		sizeFolder.open();
		levelFolder.add(level.viewBoxScale, 'value', 0, 100).name('viewBoxScale').listen();
		const positionFolder = levelFolder.addFolder('viewBoxCoordinates')
		positionFolder.add(level.viewBoxCoordinates, 'x').listen();
		positionFolder.add(level.viewBoxCoordinates, 'y').listen();
		positionFolder.open();
		levelFolder.add(level.levelMusic, 'value', this.model.levelMusicTypes).name('levelMusic').onChange(() => level.levelMusic.set(level.levelMusic.value));
		const parallaxFolder = levelFolder.addFolder('Parallax');
		parallaxFolder.add(level.parallaxType, 'value', this.model.parallaxTypes).name('parallaxType').onChange(() => level.setParallaxFromStyle(level.parallaxType.get()));
		parallaxFolder.add(level.parallax.cameraOffset, 'x').name('offset.x').listen();
		parallaxFolder.add(level.parallax.cameraOffset, 'y').name('offset.y').listen();
		parallaxFolder.open();

		const highlightFolder = this.gui.addFolder('Highlighted Position');
		highlightFolder.add(this.model.highlightedTilePosition, 'x').listen();
		highlightFolder.add(this.model.highlightedTilePosition, 'y').listen();
		highlightFolder.open();

		this.toolsFolder = this.gui.addFolder('Tools');
		this.toolsFolder.add(this.model.selectedMode, 'value', this.model.modes)
			.name('Mode')
			.onChange(() => this.model.selectedMode.makeDirty());
		this.model.selectedMode.makeDirty();

		this.toolsFolder.add(this.model.showGroundTiles, 'value')
			.name('Ground Tiles')
			.onChange(() => this.model.showGroundTiles.makeDirty());
		this.toolsFolder.add(this.model.showSpriteHelpers, 'value')
			.name('Sprite Helpers')
			.onChange(() => this.model.showSpriteHelpers.makeDirty());
		this.brushController = this.toolsFolder.add(this.model, 'brushSize', 1, 10).name('Brush');


		this.toolsFolder.open();

		const actionsFolder = this.gui.addFolder('Actions');
		actionsFolder.add(this.actions, 'reload').name('Reload');
		actionsFolder.add(this.actions, 'fitGrid').name('Fit Grid to Ground');
		actionsFolder.add(this.actions, 'download').name('Download');
		actionsFolder.add(this.actions, 'saveAndReload').name('Save & Reload');
		actionsFolder.open();

		this.gui.open();
	}

	deactivateInternal() {
		this.hideGroundTiles();
		this.hideSpriteHelpers();
		this.hideHighlights();
		this.hideAdditionalGUI();

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
		this.toolsFolder = null;

		const level = this.game.level.get();
		if (!level) {
			return;
		}

		level.sprites.forEach((sprite) => {
			if (sprite._helper) {
				sprite._helper = null;
			}
		});
		level.ground.tiles.forEach((tile) => {
			tile._helper = null;
		});
		level.ground.tiles.removeOnRemoveListener(this.tileRemovedHandler);
	}

	getLevelState() {
		return this.game.level.get().getState();
	}

	reload() {
		const level = this.game.level.get();
		this.model.levelLoadRequest.set(level.name);
	}

	async saveLevelAsync() {
		const level = this.game.level.get();
		localForage.setItem(`${EDITOR_LEVEL_NAME_PREFIX}-${level.name}`, this.getLevelState())
			.then(() => console.log('Level saved.'));
	}

	saveAndReload() {
		this.saveLevelAsync().then(() => this.reload());
	}

	download() {
		this.saveLevelAsync().then(() => {
			const element = document.createElement('a');
			const str = JSON.stringify(this.getLevelState());
			element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(str));
			element.setAttribute('download', this.game.level.get().name + '.json');
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		});
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

	renderSpriteHelper(sprite) {
		if (DEBUG_EDITOR_RENDERER) console.log('rendering sprite helper', sprite.position);
		if (!sprite._helper) {
			const level = this.game.level.get();
			const helper = this.spriteHelpers.rect(level.grid.tileSize.x, level.grid.tileSize.y);
			helper.fill('transparent');
			helper.stroke({width: 6, color: 'white'});
			const coordinates = level.grid.getCoordinates(sprite.position);
			helper.center(coordinates.x, coordinates.y);
			sprite._helper = helper;
		}
	}

	destroySpriteHelper(sprite) {
		if (sprite._helper) {
			sprite._helper.remove();
			sprite._helper = null;
		}
	}

	showSpriteHelpers() {
		this.hideSpriteHelpers();
		const level = this.game.level.get();
		level.sprites.forEach((sprite) => this.renderSpriteHelper(sprite));
		this.spriteHelpers.show();
		level.sprites.addOnAddListener(this.spriteAddedHandler);
		level.sprites.addOnRemoveListener(this.spriteRemovedHandler);
	}

	hideSpriteHelpers() {
		if (DEBUG_EDITOR_RENDERER) console.log('Hiding all sprite helpers');
		if (this.spriteHelpers) this.spriteHelpers.hide();

		const level = this.game.level.get();
		if (level) {
			level.sprites.removeOnAddListener(this.spriteAddedHandler);
		}
	}

	spriteAdded(sprite) {
		this.renderSpriteHelper(sprite);
	}

	spriteRemoved(sprite) {
		this.destroySpriteHelper(sprite);
	}

	//</editor-fold>

	//<editor-fold desc="GROUND TILES">

	renderGroundTile(tile) {
		const level = this.game.level.get();
		const helper = tile._helper;
		if (!helper) {
			const hex = this.groundTiles.group();
			const corners = level.grid
				.getCorners(new Vector2())
				.map((c) => [c.x, c.y]);
			corners.push(corners[0]);
			hex.polyline(corners).fill('transparent').stroke({width: 2, color: '#fff'});
			hex.circle(20).fill('#000').center(-10, 0);
			hex.circle(20).fill('#fff').center(10, 0);
			const coordinates = level.grid.getCoordinates(tile.position);
			hex.center(coordinates.x, coordinates.y);
			tile._helper = hex;
		}
	}

	destroyGroundTile(tile) {
		const helper = tile._helper;
		if (helper)	helper.remove();
	}

	hideGroundTiles() {
		if (DEBUG_EDITOR_RENDERER) console.log('Hiding all ground tiles');
		if (this.groundTiles) this.groundTiles.hide();
		const level = this.game.level.get();
		if (level) {
			level.ground.tiles.removeOnAddListener(this.tileAddedHandler);
		}
	}

	showGroundTiles() {
		this.hideGroundTiles();
		this.level = this.game.level.get();
		this.level.ground.tiles.forEach((tile) => this.renderGroundTile(tile));
		this.groundTiles.show();
		this.level.ground.tiles.addOnAddListener(this.tileAddedHandler);
		this.level.ground.tiles.addOnRemoveListener(this.tileRemovedHandler);
	}

	groundTileAdded(tile) {
		this.renderGroundTile(tile);
	}

	groundTileRemoved(tile) {
		this.destroyGroundTile(tile);
	}

	//</editor-fold>

	//<editor-fold desc="Additional GUI">

	hideAdditionalGUI() {
		this.additionalGUI.forEach((gui) => gui.destroy());
		this.additionalGUI = [];
	}

	newAdditionalGUI() {
		const gui = new dat.GUI();
		this.additionalGUI.push(gui);
		return gui;
	}

	addSpriteGUI(sprite) {
		const gui = this.newAdditionalGUI();
		gui.add(sprite.position, 'x').onChange(() => sprite.position.makeDirty());
		gui.add(sprite.position, 'y').onChange(() => sprite.position.makeDirty());
		gui.add(sprite.strategy, 'value', SPRITE_STRATEGIES).name('strategy').onChange(() => sprite.strategy.makeDirty());
		gui.add(sprite.oriented, 'value').name('oriented').onChange(() => sprite.oriented.makeDirty());

		const obj = {str: JSON.stringify(sprite.data)};
		gui.add(obj, 'str').name('data').listen().onChange(() => sprite.data = JSON.parse(obj.str));
		gui.add(sprite, 'type');

		if (sprite.image) {
			const imgFolder = gui.addFolder('image');
			imgFolder.add(sprite.image.path, 'value').name('path');
			imgFolder.add(sprite.image.coordinates, 'x');
			imgFolder.add(sprite.image.coordinates, 'y');
			imgFolder.add(sprite.image.rotation, 'value', -180, 180).name('rotation');
			imgFolder.open();
		}

		const actions = {
			deleteSprite: () => {
				this.model.selectedSprites.remove(sprite);
				this.level.sprites.remove(sprite);
				gui.hide();
			}
		}
		gui.add(actions, 'deleteSprite').name('Delete');
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

		if (min.x % 2 !== 0 ) {
			min.x = min.x - 1;
		}

		tiles.forEach((tile) => {
			tile.position.set(tile.position.subtract(min));
		});

		level.grid.size.set(max.subtract(min));
	}

	renderInternal() {
		if (DEBUG_EDITOR_RENDERER) console.log('Rendering editor');

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

		if (this.model.selectedSprites.isDirty()) {
			this.hideAdditionalGUI();
			const selected = this.model.selectedSprites.get();
			selected.forEach((sprite) => this.addSpriteGUI(sprite));
			this.model.selectedSprites.clean();
		}

	}

}
