import Vector2 from "../class/Vector2";
import GridModel from "../model/GridModel";
import LevelModel from "../model/LevelModel";
import GroundBuilder from "./GroundBuilder";
import {RESOURCE_TYPE_GROUP} from "../model/ResourceModel";
import HillImage from "../../res/img/hill.svg";
import StalkImage from "../../res/img/stalk.svg";
import GrassImage from "../../res/img/grass.svg";
import TreesImage from "../../res/img/trees.svg";
import BulbsImage from "../../res/img/bulbs.svg";
import PlantImage from '../../res/img/plant.svg';
import RockImage from '../../res/img/rock.svg';

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

	parallax() {
		this.parallaxState = {
			layers: [
				false,
				false,
				TreesImage,
				false,
				false,
				false,
				GrassImage,
				StalkImage,
				BulbsImage,
				false,
				false
			]
		}
	}

	build() {
		if (!this.g) {
			this.ground();
		}
		if (!this.plantState) {
			this.plant();
		}
		if (!this.parallaxState) {
			this.parallax();
		}
		const state = {
			grid: this.grid.getState(),
			parallax: this.parallaxState,
			ground: this.g.getState(),
			plant: this.plantState,
			sprites: [],
			resources: {
				resType: RESOURCE_TYPE_GROUP
			},
			viewBoxScale: this.viewboxScale,
			viewBoxSize: this.viewboxSize.toArray(),
			viewBoxCoordinates: this.viewboxCoordinates.toArray()
		};

		return new LevelModel(state);
	}

}
