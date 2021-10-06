import Vector2 from "../class/Vector2";
import GridModel from "../model/GridModel";
import LevelModel from "../model/LevelModel";
import GroundBuilder from "./GroundBuilder";
import ResourceModel from "../model/ResourceModel";
import {RESOURCE_TYPE_GROUP, RESOURCE_TYPE_IMAGE} from "../model/ResourceModel";
import HillImage from "../../res/img/hill.svg";
import StalkImage from "../../res/img/stalk.svg";
import GrassImage from "../../res/img/grass.svg";
import TreesImage from "../../res/img/trees.svg";
import EggHillsImage from "../../res/img/egghills.svg";
import BulbsImage from "../../res/img/bulbs.svg";
import PlantImage from '../../res/img/plant.svg';
import RockImage from '../../res/img/rock.svg';

export const IMAGE_HILL = 'img/hill.svg';
export const IMAGE_STALK = 'img/stalk.svg';

export default class LevelBuilder {
	grid;

	constructor(size, scale) {

		this.viewboxScale = 3;
		this.viewboxSize = new Vector2(window.innerWidth, window.innerHeight);
		this.parallaxState = {
			cameraOffset: [0, 0],
			layers: []
		};

		this.grid = new GridModel({ size: size.toArray(), scale: scale});
		this.setStart(new Vector2(Math.round(this.grid.size.x / 2), Math.round(this.grid.size.y / 2)));

		this.name = 'level-0';
		this.resources = new ResourceModel({resType: RESOURCE_TYPE_GROUP});
	}

	setName(name) {
		this.name = name;
	}

	addResource(resType, uri, data) {
		this.resources.addChild(new ResourceModel({resType: resType, uri: uri, data: data}));
	}

	setViewBoxScale(scale) {
		this.viewboxScale = scale;
	}

	setStart(position) {
		this.startPosition = position.clone();
		this.startCoords = this.grid.getCoordinates(this.startPosition);
		this.viewboxCoordinates = new Vector2(this.startCoords.x - (this.viewboxScale * this.viewboxSize.x / 2), this.startCoords.y - (this.viewboxScale * this.viewboxSize.y / 2));
	}

	setStartToTop() {
		this.viewboxCoordinates = new Vector2(this.startCoords.x - (this.viewboxScale * this.viewboxSize.x / 2), this.startCoords.y);
	}

	setStartToBottom(dist) {
		this.viewboxCoordinates = new Vector2(this.startCoords.x - (this.viewboxScale * this.viewboxSize.x / 2), this.startCoords.y - (this.viewboxScale * (this.viewboxSize.y / 2)) + dist);
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

	addParallaxLayer(image_path, image_data, distance) {
		this.addResource(RESOURCE_TYPE_IMAGE, image_path, image_data);
		this.parallaxState.layers.push({
			distance: distance,
			image: {
				path: image_path
			}
		});
	}

	parallax() {
		this.addParallaxLayer(IMAGE_HILL, HillImage, 0.5);
		this.addParallaxLayer(IMAGE_STALK, StalkImage, 0.8);
		console.log(this.parallaxState);
		/*
		this.parallaxState = {
			layers: [
				TreesImage,
				false,
				false,
				false,
				false,
				GrassImage,
				StalkImage,
				BulbsImage,
				,
				false,
				EggHillsImage,
			]
		}
		*/
	}

	build() {
		if (!this.g) {
			this.ground();
		}
		if (!this.plantState) {
			this.plant();
		}
		if (this.parallaxState.layers.length === 0) {
			this.parallax();
		}
		const state = {
			name: this.name,
			grid: this.grid.getState(),
			parallax: this.parallaxState,
			ground: this.g.getState(),
			plant: this.plantState,
			sprites: [],
			resources: this.resources.getState(),
			viewBoxScale: this.viewboxScale,
			viewBoxSize: this.viewboxSize.toArray(),
			viewBoxCoordinates: this.viewboxCoordinates.toArray()
		};
		return new LevelModel(state);
	}

}
