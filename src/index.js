import "./style.css";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js";
import ControlsModel from "./model/ControlsModel";
import GameController from "./controller/GameController";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";

const MAX_DELTA = 500;

const game = new GameModel();

const draw = SVG().addTo(window.document.body);

const controller = new GameController(game, draw.node);
controller.activate();

const renderer = new GameRenderer(game, draw);
renderer.activate();

let lastTime = null;

const updateLoop = function ()
{
	const time = performance.now();
	if (!lastTime) lastTime = time;
	const delta = (time - lastTime);
	lastTime = time;
	if (delta < MAX_DELTA) {
		controller.update(delta);
	}
	renderer.render();
	requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
