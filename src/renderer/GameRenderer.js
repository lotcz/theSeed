import SvgRenderer from "./SvgRenderer";
import Stats from "../class/stats.module";
import * as dat from 'dat.gui';
import LevelRenderer from "./LevelRenderer";
import ResourceLoader from "../class/ResourceLoader";
import InventoryRenderer from "./InventoryRenderer";
import MenuRenderer from "./MenuRenderer";
import DirtyValue from "../class/DirtyValue";
import LevelEditorRenderer from "./LevelEditorRenderer";
import MenuBuilder from "../builder/MenuBuilder";
import TextRenderer from "./TextRenderer";

const DEBUG_FPS = true;

export default class GameRenderer extends SvgRenderer {
	loadingScreenRenderer;
	levelRenderer;
	menuRenderer;
	editorRenderer;

	constructor(model, draw) {
		super(model, model, draw);

		if (DEBUG_FPS) {
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
		}

		draw.fill('black');

		this.loadingScreenRenderer = null;
		this.levelRenderer = null;
		this.menuRenderer = null;
		this.editorRenderer = null;

		this.showLoading();
	}

	render() {
		if (DEBUG_FPS) {
			this.stats.update();
		}

		if (this.model.viewBoxSize.isDirty()) {
			this.draw.size(this.model.viewBoxSize.x, this.model.viewBoxSize.y);
			this.model.viewBoxSize.clean();
		}

		if (this.model.level.isDirty()) {
			if (this.model.level.isEmpty()) {
				this.hideLevel();
				this.showLoading();
			} else {
				this.showLevel();
			}
			this.model.level.clean();
		}

		if (this.model.menu.isDirty()) {
			if (this.model.menu.isEmpty()) {
				this.hideMenu();
			} else {
				this.showMenu();
			}
			this.model.menu.clean();
		}

		if (this.model.editor.isDirty()) {
			if (this.model.editor.get())
				this.showEditor();
			else
				this.hideEditor();
			this.model.editor.clean();
		}

		this.children.forEach((r) => r.render());
		this.clean();
		this.model.clean();
	}

	showLoading() {
		this.hideLoading();
		const builder = new MenuBuilder();
		const center = this.model.viewBoxSize.multiply(0.5);
		builder.setStartPosition(center);
		const line = builder.addLine('Loading...');
		this.loadingScreenRenderer = new TextRenderer(this.game, line.text, this.draw);
		this.addChild(this.loadingScreenRenderer);
		this.loadingScreenRenderer.activate();
	}

	hideLoading() {
		if (this.loadingScreenRenderer) this.removeChild(this.loadingScreenRenderer);
		this.loadingScreenRenderer = null;
	}

	showMenu() {
		this.hideMenu();
		if (!this.game.menu.isEmpty()) {
			if (!this.game.menu.get().closed) {
				this.menuRenderer = new MenuRenderer(this.game, this.game.menu.get(), this.draw);
				this.addChild(this.menuRenderer);
				this.menuRenderer.activate();
			}
		}
	}

	hideMenu() {
		if (this.menuRenderer) this.removeChild(this.menuRenderer);
		this.menuRenderer = null;
	}

	showLevel() {
		this.hideLevel();
		this.hideEditor();
		this.hideMenu();
		this.showLoading();

		if (!this.game.level.isEmpty()) {
			const loader = new ResourceLoader(this.draw, this.game.level.get().resources);
			loader.load(() => {
				this.levelRenderer = new LevelRenderer(this.game, this.game.level.get(), this.draw);
				this.addChild(this.levelRenderer);
				this.levelRenderer.activate();
				this.hideLoading();
				this.showMenu();
				if (this.model.editor.get()) {
					this.showEditor();
				}
			});
		}
	}

	hideLevel() {
		if (this.levelRenderer) this.removeChild(this.levelRenderer);
		this.levelRenderer = null;
	}

	showEditor() {
		this.hideEditor();
		if (!this.model.editor.isEmpty()) {
			this.editorRenderer = new LevelEditorRenderer(this.game, this.model.editor.get(), this.draw);
			this.addChild(this.editorRenderer);
			this.editorRenderer.activate();
		}
	}

	hideEditor() {
		if (this.editorRenderer !== null) {
			this.removeChild(this.editorRenderer);
			this.editorRenderer = null;
		}
	}

}
