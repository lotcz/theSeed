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
import HexGridModel from "../model/HexGridModel";
import LevelModel from "../model/LevelModel";
import SpriteModel from "../model/SpriteModel";
import {STRATEGY_BUG, STRATEGY_BUTTERFLY, STRATEGY_TURNER, STRATEGY_WORM} from "../controller/SpriteController";
import Pixies from "../class/Pixies";
import GroundBuilder from "./GroundBuilder";

export default class LevelBuilder {
	grid;

	constructor(size, scale) {

		this.viewboxScale = 1;
		this.viewboxSize = new Vector2(window.innerWidth, window.innerHeight);

		this.grid = new HexGridModel({ size: size.toArray(), scale: scale});;
		this.setStart(new Vector2(Math.round(this.grid.size.x / 2), Math.round(this.grid.size.y / 2)));

		this.sprites = [];
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

	bugs() {
		const bugCount = 10;
		const images = [MyLadybugImage];
		for (let i = 0, max = bugCount; i < max; i++) {
			const state = {
				image: {
					position: [0, 0],
					scale: 0.2 + (Math.random() * 2),
					flipped: (0.5 > Math.random()),
					rotation: 0,
					path: Pixies.randomElement(images)
				},
				strategy: STRATEGY_BUG
			};
			this.sprites.push(new SpriteModel(state));
		}

		const fliesCount = 10;
		const flyImages = [ButterflyImage];
		for (let i = 0, max = fliesCount; i < max; i++) {
			const state = {
				image: {
					position: [0, 0],
					scale: 0.5 + Math.random(),
					flipped: false,
					rotation: 0,
					path: Pixies.randomElement(flyImages)
				},
				strategy: STRATEGY_BUTTERFLY
			};
			this.sprites.push(new SpriteModel(state));
		}

		const wormsCount = 10;
		const wormsImages = [WormImage];
		for (let i = 0, max = wormsCount; i < max; i++) {
			const state = {
				image: {
					position: [0, 0],
					scale: 0.5 + Math.random(),
					flipped: false,
					rotation: 0,
					path: Pixies.randomElement(wormsImages)
				},
				strategy: STRATEGY_WORM
			};
			this.sprites.push(new SpriteModel(state));
		}

		const turner = {
			image: {
				position: [0, 0],
				scale: 1,
				flipped: false,
				rotation: 0,
				path: ButterflyImage
			},
			strategy: STRATEGY_TURNER
		};
		this.sprites.push(new SpriteModel(turner));
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

		this.bugs();

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
			sprites: SpriteModel.getArrayState(this.sprites),
			viewBoxScale: this.viewboxScale,
			viewBoxSize: this.viewboxSize.toArray(),
			viewBoxCoordinates: this.viewboxCoordinates.toArray()
		};

		return new LevelModel(state);
	}

}
