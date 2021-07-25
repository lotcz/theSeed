import Vector2 from "../class/Vector2";
import GroundModel from "../model/GroundModel";
import ButterflyImage from "../../res/img/butterfly.svg";
import LadybugImage from "../../res/img/ladybug.svg";
import MyLadybugImage from "../../res/img/my-lady-bug.svg";
import Bug1Image from "../../res/img/bug-1.svg";
import BeetleImage from "../../res/img/beetle.svg";
import DragonflyImage from "../../res/img/dragonfly.svg";
import WormImage from "../../res/img/worm.svg";
import CoccinelleImage from "../../res/img/coccinelle.svg";
import GridModel from "../model/GridModel";
import LevelModel from "../model/LevelModel";
import SpriteModel from "../model/SpriteModel";
import {STRATEGY_BUG, STRATEGY_BUTTERFLY, STRATEGY_TURNER, STRATEGY_WORM} from "../controller/SpriteController";
import Pixies from "../class/Pixies";
import GroundBuilder from "./GroundBuilder";

export default class LevelBuilder {
	grid;

	constructor(size, scale) {

		this.viewboxScale = 3;
		this.viewboxSize = new Vector2(window.innerWidth, window.innerHeight);

		this.grid = new GridModel({ size: size.toArray(), scale: scale});
		this.setStart(new Vector2(Math.round(this.grid.size.x / 2), Math.round(this.grid.size.y / 2)));

	}

	setStart(position) {
		this.startPosition = position.clone();
		this.startCoords = this.grid.getCoordinates(this.startPosition);
		this.viewboxCoordinates = new Vector2(this.startCoords.x - (this.viewboxScale * this.viewboxSize.x / 2), this.startCoords.y - (this.viewboxScale * this.viewboxSize.y / 2));
	}

	plant() {
		this.plantState = {
			roots: {
				position: this.startPosition.toArray(),
					power: 3,
					children: [
					{
						position: [this.startPosition.x, this.startPosition.y + 1],
						power: 2,
						children: [
							{
								position: [this.startPosition.x, this.startPosition.y + 2],
								power: 1
							}
						]
					}
				]
			},
			stem: {
				position: this.startPosition.toArray(),
					power: 3,
					children: [
					{
						position: [this.startPosition.x, this.startPosition.y - 1],
						power: 2,
						children: [
							{
								position: [this.startPosition.x, this.startPosition.y - 2],
								power: 1
							}
						]
					}
				]
			},
		};
	}

	ground(preset) {
		const builder = new GroundBuilder(this.grid);
		if (preset) {
			builder.generateFromPreset(this.startPosition, preset);
		} else {
			builder.generateRandom(this.startPosition);
		}
		this.g = builder.build();
	}

	build() {
		if (!this.g) {
			this.ground();
		}
		if (!this.plantState) {
			this.plant();
		}
		const state = {
			grid: this.grid.getState(),
			ground: this.g.getState(),
			plant: this.plantState,
			sprites: [],
			viewBoxScale: this.viewboxScale,
			viewBoxSize: this.viewboxSize.toArray(),
			viewBoxCoordinates: this.viewboxCoordinates.toArray()
		};

		return new LevelModel(state);
	}

}
