import Vector2 from "./Vector2";
import GroundModel from "../model/GroundModel";
import ButterflyImage from "../../res/img/butterfly.svg";
import LadybugImage from "../../res/img/ladybug.svg";
import Bug1Image from "../../res/img/bug-1.svg";
import BeetleImage from "../../res/img/beetle.svg";
import CoccinelleImage from "../../res/img/coccinelle.svg";
import HexGridModel from "../model/HexGridModel";
import LevelModel from "../model/LevelModel";
import SpriteModel, {STRATEGY_BUG} from "../model/SpriteModel";

export default class LevelBuilder {
	grid;

	constructor(size, scale) {
		this.grid = new HexGridModel({ size: size.toArray(), scale: scale});;
		this.startPosition = new Vector2(this.grid.size.x / 2, this.grid.size.y / 2);
		this.startCoords = this.grid.getCoordinates(this.startPosition);
		this.viewboxScale = 5;
		this.viewboxSize = new Vector2(window.innerWidth, window.innerHeight);
		this.viewboxCoordinates = new Vector2(this.startCoords.x - (this.viewboxScale * this.viewboxSize.x / 2), this.startCoords.y - (this.viewboxScale * this.viewboxSize.y / 2));
		this.sprites = [];
	}

	plant() {
		this.plantState = {
			roots: {
				position: this.startPosition.toArray(),
					power: 3,
					children: [
					{
						position: new Vector2(this.startPosition.x, this.startPosition.y + 1).toArray(),
						power: 2,
						children: [
							{
								position: new Vector2(this.startPosition.x, this.startPosition.y + 2).toArray(),
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
						position: new Vector2(this.startPosition.x, this.startPosition.y - 1).toArray(),
						power: 2,
						children: [
							{
								position: new Vector2(this.startPosition.x, this.startPosition.y - 2).toArray(),
								power: 1
							}
						]
					}
				]
			},
		};
	}

	bugs() {
		const state = {
			image: {
				position: [0, 0],
				scale: 1,
				flipped: false,
				rotation: 0,
				path: ButterflyImage
			},
			strategy: STRATEGY_BUG
		};
		this.sprites.push(new SpriteModel(state));

		const coccinella = {
			image: {
				position: [0, 0],
				scale: 1,
				flipped: false,
				rotation: 0,
				path: CoccinelleImage
			},
			strategy: STRATEGY_BUG
		};
		this.sprites.push(new SpriteModel(coccinella));
	}

	build() {
		this.bugs();
		if (!this.ground) {
			this.ground = new GroundModel({position: this.startPosition.toArray(), points: []});
			this.ground.generateRandom(this.grid, this.startPosition);
		}
		if (!this.plantState) {
			this.plant();
		}
		const state = {
			grid: this.grid.getState(),
			ground: this.ground.getState(),
			plant: this.plantState,
			sprites: SpriteModel.getArrayState(this.sprites),
			viewBoxScale: this.viewboxScale,
			viewBoxSize: this.viewboxSize.toArray(),
			viewBoxCoordinates: this.viewboxCoordinates.toArray()
		};

		return new LevelModel(state);
	}

}
