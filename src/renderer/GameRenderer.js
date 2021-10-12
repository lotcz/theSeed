import SvgRenderer from "./SvgRenderer";
import Stats from "../class/stats.module";
import LevelRenderer from "./LevelRenderer";
import MenuRenderer from "./MenuRenderer";
import LevelEditorRenderer from "./LevelEditorRenderer";
import MenuBuilder from "../builder/MenuBuilder";
import TextRenderer from "./TextRenderer";
import ResourcesLoader from "../class/ResourcesLoader";
import DomRenderer from "./DomRenderer";
import ModelBase from "../model/ModelBase";
import TextModel from "../model/TextModel";
import Pixies from "../class/Pixies";

const DEBUG_FPS = true;

export default class GameRenderer extends SvgRenderer {
	loadingScreenRenderer;
	levelRenderer;
	menuRenderer;
	editorRenderer;
	dom;

	constructor(model, draw) {
		super(model, model, draw);

		this.dom = this.draw.root().parent().node;

		if (DEBUG_FPS) {
			this.stats = new Stats();
			this.dom.appendChild(this.stats.dom);
		}

		this.loadingScreenDom = null;
		this.loadingScreenRenderer = null;
		this.levelRenderer = null;
		this.menuRenderer = null;
		this.editorRenderer = null;

		this.draw.fill('black');

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
		if (!this.loadingScreenRenderer) {
			this.loadingScreenDom = Pixies.createElement(this.dom, 'div', 'loading');
			this.loadingScreenRenderer = new DomRenderer(this.game, this.model, this.loadingScreenDom);
			this.loadingScreenRenderer.addChild(new TextRenderer(this.game, new TextModel({label: 'Loading...'}), this.loadingScreenDom));
			this.addChild(this.loadingScreenRenderer);
			this.loadingScreenRenderer.activate();
		}
	}

	hideLoading() {
		if (this.loadingScreenRenderer) {
			Pixies.destroyElement(this.loadingScreenDom);
			this.removeChild(this.loadingScreenRenderer);
		}
		this.loadingScreenRenderer = null;
		this.loadingScreenDom = null;
	}

	showMenu() {
		this.hideMenu();
		if (!this.game.menu.isEmpty()) {
			if (!this.game.menu.get().closed) {
				this.menuRenderer = new MenuRenderer(this.game, this.game.menu.get(), this.dom);
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
			const loader = new ResourcesLoader(this.draw, this.game.level.get().resources);
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
