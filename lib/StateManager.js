export class StateManager {
	constructor(initialState = {}) {
		this.subscribers = new Map();
		this.model = initialState;
	}

	getState() {
		return this.model;
	}

	subscribe(component, selector) {
		if (!this.subscribers.has(component)) {
			this.subscribers.set(component, selector);
		}
	}

	unsubscribe(component) {
		this.subscribers.delete(component);
	}

	async updateModel(newModel) {
		this.model = { ...this.model, ...newModel };

		// Notify subscribers
		for (const [component, selector] of this.subscribers) {
			const selectedState = selector(this.model);
			const stateRepresentation = component.computeState(selectedState);
			component._scheduleUpdate(stateRepresentation);
		}
	}
}
