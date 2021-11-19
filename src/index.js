import "./style.css";
import {SVG} from "@svgdotjs/svg.js";
import {} from "@svgdotjs/svg.filter.js";
import GameController from "./controller/GameController";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";
import Pixies from "./class/Pixies";

const MAX_DELTA = 500;
const DEBUG_MASTER = false;

const game = new GameModel();

const draw = SVG().addTo(window.document.body);

const controller = new GameController(game, draw.node);
controller.activate();

const renderer = new GameRenderer(game, draw);
renderer.activate();

let lastTime = null;

let cycles = 0;
let renderingSession = null;
let controllingSession = null;

const updateLoop = function ()
{
	const time = performance.now();
	if (!lastTime) lastTime = time;
	const delta = (time - lastTime);
	lastTime = time;

	if (delta < MAX_DELTA)
	{
		if (DEBUG_MASTER) {
			if (cycles <= 0) {
				cycles = 250;
				if (renderingSession) Pixies.finishDebugSession(renderingSession);
				if (controllingSession) Pixies.finishDebugSession(controllingSession);
				renderingSession = Pixies.startDebugSession(`Rendering ${cycles} cycles.`);
				Pixies.pauseDebugSession(renderingSession);
				controllingSession = Pixies.startDebugSession(`Controlling ${cycles} cycles`);
			}
			cycles--;
			Pixies.resumeDebugSession(controllingSession);
		}

		controller.update(delta);

		if (DEBUG_MASTER) {
			Pixies.pauseDebugSession(controllingSession);
			Pixies.resumeDebugSession(renderingSession);
		}

		renderer.render();

		if (DEBUG_MASTER) {
			Pixies.pauseDebugSession(renderingSession);
		}
	} else {
		console.log('skipped frame');
	}
	requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
