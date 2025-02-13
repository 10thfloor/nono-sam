import { Component } from "../lib/Component.js";
import { INC_COUNTER } from "./actions.js";

export class Hello extends Component {
	constructor() {
		super();
		this.events({
			"click #inc": this.action(INC_COUNTER, 1),
		});
	}

	render({ counter }) {
		return this.html`
			<div class="hello">
				HELLO! ${counter}
				<button id="inc">
					Increment Counter
				</button>
			</div>
		`;
	}
}
