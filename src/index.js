import "./style.css";
import GameController from "./controller/GameController";

const controller = new GameController(window.document.body);
controller.update();
