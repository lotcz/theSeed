export default class Random {

	static randomElement(arr) {
		return arr[Random.randomIndex(arr.length)];
	}

	static randomIndex(length) {
		return Math.floor(Math.random() * length);
	}

}
