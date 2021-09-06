import Dirty from "./Dirty";
import Vector2 from "./Vector2";
import DirtyValue from "./DirtyValue";

export default class Controls extends Dirty {
	dom;
	mouseOver;
	mouseCoords;
	mouseClick;
	zoom;

	constructor(dom) {
		super();
		this.dom = dom || window.document.body;
		this.mouseClick = null;
		this.mouseDown = false;
		this.mouseOver = false;
		this.mouseCoords = new Vector2(0, 0);
		this.zoom = new DirtyValue(0);
		this.resetZoom();
		this.dom.addEventListener('mousemove', (e) => this.onMouseMove(e));
		this.dom.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
		this.dom.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
		this.dom.addEventListener('click', (e) => this.onClick(e));
		this.dom.addEventListener('mousedown', (e) => this.onMouseDown(e));
		this.dom.addEventListener('mouseup', (e) => this.onMouseUp(e));
		this.dom.addEventListener('wheel', (e) => this.onZoom(e));
	}

	onMouseMove(e) {
		this.mouseCoords = new Vector2(e.offsetX, e.offsetY);
		this.mouseOver = true;
		this.makeDirty();
	}

	onMouseEnter(e) {
		if (!this.mouseOver) {
			this.mouseOver = true;
			this.makeDirty();
		}
		this.mouseDown = ((e.buttons == 1) || (e.buttons == 3));
	}

	onMouseLeave(e) {
		if (this.mouseOver) {
			this.mouseOver = false;
			this.makeDirty();
		}
	}

	onClick(e) {
		this.mouseClick = new Vector2(e.offsetX, e.offsetY);
		this.makeDirty();
	}

	onMouseDown(e) {
		this.mouseDown = true;
		this.makeDirty();
	}

	onMouseUp(e) {
		this.mouseDown = false;
		this.makeDirty();
	}

	onZoom(e) {
		this.zoom.set(e.deltaY > 0 ? 1 : -1);
		this.makeDirty();
	}

	resetZoom() {
		this.zoom.set(0);
		this.zoom.clean();
	}

}
