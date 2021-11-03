const HAVE_ENOUGH_DATA = 4;

export default class Sound {
	audio;

	constructor(src, options) {
		this.audio = new Audio();
		this.audio.src = src;
		options = options || {};
		this.audio.loop = options.loop || false;
		this.audio.autoplay = options.autoplay || false;
		this.audio.controls = options.controls || false;
		this.audio.muted = options.muted || false;
	}

	rewind() {
		this.audio.currentTime = 0;
	}

	stop() {
		this.pause();
		this.rewind();
	}

	replay() {
		this.stop();
		this.play();
	}

	play() {
		if (this.audio.readyState === HAVE_ENOUGH_DATA) {
			this.audio.play();
		} else {
			this.audio.addEventListener("canplaythrough", event => {
				this.audio.play();
			});
		}
	}

	pause() {
		this.audio.pause();
	}

}
