export default class Pixies {

	static randomElement(arr) {
		return arr[Pixies.randomIndex(arr.length)];
	}

	static randomIndex(length) {
		return Math.floor(Math.random() * length);
	}

	static between(min, max, n) {
		return Math.min(Math.abs(max), Math.max(-Math.abs(min), n));
	}

	static hash(value) {
		let hash = 0;
		if (value.length == 0) return hash;
		for (let i = 0 ; i < value.length ; i++)
		{
			let ch = value.charCodeAt(i);
			hash = ((hash << 5) - hash) + ch;
			hash = hash & hash;
		}
		return hash;
	}

	static token(value) {
		let hash = Pixies.hash(value);
		if (hash == 0) return '0';
		let token = 'a';
		if (hash < 0) {
			token = 'b';
			hash = -hash;
		}
		while (hash > 0)
		{
			const rem = hash % 256;
			hash = (hash - rem) / 256;
			token += rem;
		}
		return token;
	}

	static addClass(element, css) {
		if (Array.isArray((css)) && css.length > 0) {
			css.forEach((c) => element.classList.add(c));
		} else if (css) {
			element.classList.add(css);
		}
	}

	static createElement(parent, tag, css = null) {
		const el = document.createElement(tag);
		if (css !== null) {
			this.addClass(el, css);
		}
		if (parent) {
			parent.appendChild(el);
		}
		return el;
	}

	static destroyElement(el) {
		if (el) {
			el.parentNode.removeChild(el);
			el.remove();
		}
	}

}
