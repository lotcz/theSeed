import "./style.css";
import {SVG} from "@svgdotjs/svg.js";
import Vector2 from "./class/Vector2";
import Controls from "./class/Controls";
import GameController from "./controller/GameController";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";
import LevelBuilder from "./builder/LevelBuilder";
import SpriteBuilder from "./builder/SpriteBuilder";
import {GROUND_PRESET_HILL} from "./builder/GroundBuilder";
import MenuModel from "./model/MenuModel";
import MenuBuilder from "./builder/MenuBuilder";

const MAX_DELTA = 500;

const game = new GameModel();

const draw = SVG().addTo(window.document.body);
const controls = new Controls(draw.node);

const controller = new GameController(game, controls);
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


//console.log(game.getState());
