import ModelBase from "../class/ModelBase";
import Vector2 from "../class/Vector2";
import {NEIGHBOR_TYPE_UP} from "./GridModel";

export default class HintModel extends ModelBase {
	position;
	imagePath;
	direction;

	constructor() {
		super();

		this.position = new Vector2();
		this.imagePath = '';
		this.direction = NEIGHBOR_TYPE_UP;
	}

}
