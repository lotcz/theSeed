import SvgRenderer from "./SvgRenderer";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js"

import Stats from "../class/stats.module";
import * as dat from 'dat.gui';
import LevelRenderer from "./LevelRenderer";
import ResourceLoader from "../class/ResourceLoader";
import InventoryRenderer from "./InventoryRenderer";
import MenuRenderer from "./MenuRenderer";
import DirtyValue from "../class/DirtyValue";

const DEBUG_FPS = true;

export default class GameRenderer extends SvgRenderer {

	constructor(model, draw) {
		super(model, model, draw);

		if (DEBUG_FPS) {
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
		}

		this.loadingScreen = null;
		this.levelRenderer = null;
		this.menuRenderer = null;
		this.loadLevel();
	}

	showLoading() {
		this.hideLoading();
		this.loadingScreen = this.draw.text(
			function(add) {
				add.tspan('Loading...')
			}
		).font({
			family:   'Helvetica',
			size:     144,
			anchor:   'middle',
			leading:  '1.5em'
		}).fill('blue');

		const center = this.model.viewBoxSize.multiply(0.5);
		this.loadingScreen.center(center.x, center.y);
		//this.loadingScreen.path('M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80');
	}

	hideLoading() {
		if (this.loadingScreen) this.loadingScreen.remove();
		this.loadingScreen = null;
	}

	render() {
		if (DEBUG_FPS) {
			this.stats.update();
		}

		if (this.model.viewBoxSize.isDirty()) {
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.model.viewBoxSize.clean();
		}

		if (this.model.levelChanged.isDirty()) {
			if (this.model.levelChanged.get()) {
				this.model.levelChanged.set(false);
				this.loadLevel();
			}
			this.model.levelChanged.clean();
		}

		if (this.model.loading.isDirty()) {
			if (this.model.loading.get())
				this.showLoading();
			else
				this.hideLoading();
			this.model.loading.clean();
		}

		if (this.model.menuChanged.isDirty()) {
			if (this.model.menuChanged.get()) {
				this.model.menuChanged.set(false);
				this.showMenu();
			}
			this.model.menuChanged.clean();
		}

		this.children.forEach((r) => r.render());
		this.clean();
		this.model.clean();
	}

	showMenu() {
		if (this.menuRenderer) this.removeChild(this.menuRenderer);
		if (this.game.menu && !this.game.menu.closed) {
			this.menuRenderer = new MenuRenderer(this.game, this.game.menu, this.draw);
			this.addChild(this.menuRenderer);
			this.menuRenderer.activate();
		}
	}

	loadLevel() {
		if (this.levelRenderer) this.removeChild(this.levelRenderer);
		if (this.game.level) {
			this.model.loading.set(true);
			const loader = new ResourceLoader(this.draw, this.model.level.resources);
			loader.load(() => {
				this.model.loading.set(false);
				this.levelRenderer = new LevelRenderer(this.game, this.game.level, this.draw);
				this.addChild(this.levelRenderer);
				this.levelRenderer.activate();
			});
		}
	}

}
