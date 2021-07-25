import RendererBase from "./RendererBase";
import Pixies from "../class/Pixies";

export default class SvgRenderer extends RendererBase {
	draw;

	constructor(game, model, draw) {
		super(game, model);
		this.draw = draw;
	}

	getRef(name, construct) {
		const token = Pixies.token(name);
		const defs = this.draw.root().defs();
		let ref = defs.findOne('#' + token);
		if (!ref) {
			ref = construct();
			ref.attr({id:token});
			this.draw.root().defs().add(ref);
		}
		return ref;
	}

}
