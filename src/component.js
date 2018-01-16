import { Component } from "../lib/Component.js";
import e from "../lib/escapeHTML.js";
import { INC_COUNTER } from "./actions.js";

export class Hello extends Component {
  constructor() {
    super();
    this.events({
      "click #inc": this.action(INC_COUNTER, 1)
    });
  }
  render({ counter }) {
    return `HELLO! ${e(counter)} <button id="inc">Increment Counter</button>`;
  }
}
