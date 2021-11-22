export default class DecisionTree {
	userFunc; //condition or action;
	onConditionTrue;
	onConditionFalse;

	constructor(userFunc, onConditionTrue = null, onConditionFalse = null) {
		this.userFunc = userFunc;
		this.onConditionFalse = onConditionFalse;
		this.onConditionTrue = onConditionTrue;
	}

	isAction() {
		return this.onConditionTrue === null && this.onConditionFalse === null;
	}

	execute() {
		if (this.isAction()) {
			this.userFunc();
		} else {
			const conditionResult = this.userFunc();
			if (conditionResult) {
				if (this.onConditionTrue) {
					this.onConditionTrue.execute();
				}
			} else {
				if (this.onConditionFalse) {
					this.onConditionFalse.execute();
				}
			}
		}
	}

}
