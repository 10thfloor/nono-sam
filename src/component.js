import { SAMComponent } from "../lib/Component.js";
import { INC_COUNTER, RESET_COUNTER } from "./actions.js";

export class Hello extends SAMComponent {
	constructor() {
		super();
		this.events({
			"click #inc": this.action(INC_COUNTER, 1),
		});
	}

	createModel() {
		return { counter: 0 };
	}

	// Define state representation
	computeState(model) {
		return {
			counter: model.counter,
			isHigh: model.counter > 5,
			displayClass: model.counter > 5 ? "high-value" : "normal-value",
		};
	}

	accept(model, action) {
		switch (action.type) {
			case INC_COUNTER:
				// Accept the action and return the new model
				return { counter: model.counter + action.amount };
			case RESET_COUNTER:
				return { counter: 0 };
			default:
				return model;
		}
	}

	napRules = [
		(model) => {
			if (model.counter > 10) {
				return { type: RESET_COUNTER };
			}
		},
	];

	render({ counter, isHigh, displayClass }) {
		return this.html`
        <div class="hello ${displayClass}">
            HELLO! ${counter}
            <button id="inc" ${isHigh ? "disabled" : ""}>
                Increment Counter
            </button>
        </div>
    `;
	}
}
