import "./style.css";
import GameController from "./controller/GameController";
import LevelBuilder from "./builder/LevelBuilder";
import Vector2 from "./class/Vector2";
import {SVG} from "@svgdotjs/svg.js";
import Controls from "./class/Controls";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";
import SpriteBuilder from "./builder/SpriteBuilder";

const MAX_DELTA = 500;
const size = new Vector2(320, 240);
const scale = 80;

const levelBuilder = new LevelBuilder(size, scale);
const level = levelBuilder.build();
const spriteBuilder = new SpriteBuilder(level);
spriteBuilder.addBugs();
spriteBuilder.addTurner();
spriteBuilder.addWater();
const game = new GameModel();

const draw = SVG().addTo(window.document.body);
const controls = new Controls(draw.node);

const controller = new GameController(game, controls);
controller.activate();

const renderer = new GameRenderer(game, draw);
renderer.activate();

controller.loadLevel(level);

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
