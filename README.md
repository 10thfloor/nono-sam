# nono-sam
Demo of HTML Component class, using State -> Action -> Model pattern.

eg
```javascript
import { SAMComponent, SafeHTML } from "../lib/Component.js";
import { INC_COUNTER, RESET_COUNTER } from "./actions.js";

export class Hello extends SAMComponent {
	constructor() {
		super();
		this.events({
			"click #inc": this.action(INC_COUNTER, 1),
		});
	}

	createLocalModel() {
		return { counter: 0 };
	}

	selectGlobalState(globalState) {
		// Merged into model
		return {
			tasks: globalState?.tasks,
		};
	}

	// Define state representation
	computeState(model) {
		return {
			counter: model.counter,
			isHigh: model.counter > 5,
			displayClass: model.counter > 5 ? "high-value" : "normal-value",
			tasks: model.tasks, // Should be the array from global state
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

	render(state) {
		return this.html`
        <div class="hello ${state.displayClass}">
            HELLO! ${state.counter}
            <button id="inc" ${state.isHigh ? "disabled" : ""}>
                Increment Counter
            </button>
            <ul>
            ${state.tasks
							.map(
								(task) => this.html`
                  <li class="task">
                    ${task}
                  </li>
                `,
							)
							.join("")}
          </ul>
        </ul>
        </div>
    `;
	}
}
```
