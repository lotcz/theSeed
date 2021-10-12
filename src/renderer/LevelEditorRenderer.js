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

export default class LevelEditorRenderer extends SvgRenderer {
	group;

	constructor(game, model, draw) {
		super(game, model, draw);

		this.gui = null;
		this.group = null;
	}

	activateInternal() {
		this.group = this.draw.group();
		this.group.addClass('level-editor');

		this.gui = new dat.GUI();
		this.gui.add(this.level, 'name').listen()
		const actions = {
			save: () => {
				const state = this.level.getState();
				const text = JSON.stringify(state);
				localStorage.setItem('beehive-savegame-' + state.name, text);
				console.log('Level saved.');
				//_this.download('beehive-savegame-' + state.name, text);
			}
		};

		this.gui.add(actions,'save').name('Save');

		this.gui.add(this.model, 'selectedMode', this.model.modes);
		this.gui.add(this.model, 'brush');
		this.gui.add(this.model, 'selectedGroundType', this.model.groundTypes);
		this.gui.add(this.model, 'selectedSpriteType', this.model.spriteTypes);


		const gridFolder = this.gui.addFolder('grid')
		gridFolder.add(this.grid, 'scale').listen();
		const gridsizeFolder = gridFolder.addFolder('size')
		gridsizeFolder.add(this.grid.size, 'x').listen();
		gridsizeFolder.add(this.grid.size, 'y').listen();
		const scaleFolder = this.gui.addFolder('viewBoxScale')
		scaleFolder.add(this.level.viewBoxScale, 'value', 0, 100).listen();
		const sizeFolder = this.gui.addFolder('viewBoxSize')
		sizeFolder.add(this.level.viewBoxSize, 'x').listen();
		sizeFolder.add(this.level.viewBoxSize, 'y').listen();
		const positionFolder = this.gui.addFolder('viewBoxCoordinates')
		positionFolder.add(this.level.viewBoxCoordinates, 'x').listen();
		positionFolder.add(this.level.viewBoxCoordinates, 'y').listen();
		const parallaxFolder = this.gui.addFolder('Parallax Camera Offset')
		parallaxFolder.add(this.level.parallax.cameraOffset, 'x').listen();
		parallaxFolder.add(this.level.parallax.cameraOffset, 'y').listen();

		this.gui.open();
	}

	deactivateInternal() {
		if (this.group) {
			this.group.remove();
			this.group = null;
		}
		if (this.gui) {
			this.gui.destroy();
			this.gui = null;
		}
	}

	download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	renderInternal() {
		console.log('rendering editr');

	}

}
