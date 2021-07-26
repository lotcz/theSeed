import RendererBase from "./RendererBase";
import Pixies from "../class/Pixies";

export default class SvgRenderer extends RendererBase {
	draw;

	constructor(game, model, draw) {
		super(game, model);
		this.draw = draw;
	}

	getRef(uri) {
		const token = Pixies.token(uri);
		const defs = this.draw.root().defs();
		let ref = defs.findOne('#' + token);
		if (!ref) {
			console.error(`Resource ${uri} (token: ${token}) not found!`)
		}
		return ref;
	}

}
