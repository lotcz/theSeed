import "./style.css";
import GameController from "./controller/GameController";
import ButterflyImage from "../res/img/butterfly.svg";
import LevelBuilder from "./class/LevelBuilder";
import HexGridModel from "./model/HexGridModel";
import Vector2 from "./class/Vector2";
import {SVG} from "@svgdotjs/svg.js";
import Controls from "./class/Controls";
import GameModel from "./model/GameModel";
import GameRenderer from "./renderer/GameRenderer";

const size = new Vector2(320, 240);
const scale = 80;
const levelBuilder = new LevelBuilder(size, scale);
const level = levelBuilder.build();

const game = new GameModel();
game.level = level;

const draw = SVG().addTo(window.document.body);
const controls = new Controls(draw.node);

const controller = new GameController(game, controls);
const renderer = new GameRenderer(game, draw);

let lastTime = null;

const updateLoop = function ()
{
	const time = performance.now();
	if (!lastTime) lastTime = time;
	const delta = (time - lastTime);
	lastTime = time;
	controller.update(delta);
	renderer.render();
	requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);

console.log(game.getState());
