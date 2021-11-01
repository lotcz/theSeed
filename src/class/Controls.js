import Dirty from "./Dirty";
import Vector2 from "./Vector2";
import DirtyValue from "./DirtyValue";

const CLICK_TIMEOUT = 150;

export default class Controls extends Dirty {
	dom;
	mouseOver;
	mouseCoords;
	mouseClick;
	zoom;

	constructor(dom) {
		super();
		this.dom = dom || window.document.body;
		this.clickTime = 0;
		this.mouseClick = null;
		this.mouseClickLeft = false;
		this.mouseClickRight = false;
		this.mouseDownLeft = false;
		this.mouseDownRight = false;
		this.mouseOver = false;
		this.mouseCoords = new Vector2(0, 0);
		this.menuRequested = new DirtyValue(false);
		this.zoom = new DirtyValue(0);
		this.resetZoom();

		this.moveUp = false;
		this.moveLeft = false;
		this.moveDown = false;
		this.moveRight = false;
		this.fire = false;
		this.interact = false;

		this.dom.addEventListener('mousemove', (e) => this.onMouseMove(e));
		this.dom.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
		this.dom.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
		//this.dom.addEventListener('click', (e) => this.onClick(e));
		this.dom.addEventListener('mousedown', (e) => this.onMouseDown(e));
		this.dom.addEventListener('mouseup', (e) => this.onMouseUp(e));
		this.dom.addEventListener('wheel', (e) => this.onZoom(e), {passive: true});
		window.addEventListener('keydown', (e) => this.onKeyDown(e), false );
		window.addEventListener('keyup', (e) => this.onKeyUp(e), false );
		window.addEventListener('contextmenu', (e) => this.onContextMenu(e), false );
	}

	anyMovement() {
		return this.moveUp || this.moveLeft || this.moveDown || this.moveRight;
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
		this.onMouseDown(e);
	}

	onMouseLeave(e) {
		if (this.mouseOver) {
			this.mouseOver = false;
			this.makeDirty();
		}
	}

	onContextMenu(e) {
		e.preventDefault();
		e.stopPropagation();
		//this.mouseClick = new Vector2(e.offsetX, e.offsetY);
		//this.mouseClickLeft = false;
		//this.makeDirty();
		return false;
	}

	onMouseDown(e) {
		this.clickTime = performance.now();
		this.mouseDownLeft = ((e.buttons == 1) || (e.buttons == 3));
		this.mouseDownRight = (e.buttons == 2);
		this.makeDirty();
	}

	onMouseUp(e) {
		const time = performance.now();
		if ((time - this.clickTime) < CLICK_TIMEOUT) {
			this.mouseClick = new Vector2(e.offsetX, e.offsetY);
			this.mouseClickLeft = this.mouseDownLeft;
			this.mouseClickRight = this.mouseDownRight;
		}
		this.mouseDownLeft = ((e.buttons == 1) || (e.buttons == 3));
		this.mouseDownRight = (e.buttons == 2);
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

	onKeyDown(event) {
		this.caps = event.getModifierState("CapsLock");
		//console.log(event);
		const key = event.keyCode ? event.keyCode : event.charCode;

		switch (key) {
			case 38: /*up*/
			case 87: /*W*/ this.moveUp = true; break;
			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;
			case 40: /*down*/
			case 83: /*S*/ this.moveDown = true; break;
			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;
			case 69: /*E*/ this.interact = true; break;
			case 32: /*space*/
			case 13: /*Enter*/ this.fire = true; break;
			case 27: /*Ecs*/ this.menuRequested.set(true); break;
		}
		this.makeDirty();
	}

	onKeyUp(event) {
		this.caps = event.getModifierState("CapsLock");
		const key = event.keyCode ? event.keyCode : event.charCode;
		//console.log("key:" + key);
		switch( key ) {
			case 38: /*up*/
			case 87: /*W*/ this.moveUp = false; break;
			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;
			case 40: /*down*/
			case 83: /*S*/ this.moveDown = false; break;
			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;
			case 69: /*E*/ this.interact = false; break;
			case 32: /*space*/
			case 13: /*Enter*/ this.fire = false; break;
		}
		this.makeDirty();
	}

}
