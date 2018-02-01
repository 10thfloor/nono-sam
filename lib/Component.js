import escapeHTML from "./escapeHTML.js";
import asyncForEach from "./asyncForEach.js";

import { actions } from "../src/actions.js";
import { model, present } from "../src/model.js";
import { state } from "../src/state.js";

class Component extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  action(name, data) {
    return () => {
      this.view(state(present(actions[name](data))));
    };
  }

  events(eventsObj) {
    this.eventsObj = eventsObj;
  }

  view(viewState) {
    this.shadow.innerHTML = this.render(viewState);
    asyncForEach(Object.entries(this.eventsObj), ([eventEl, handler]) => {
      const [event, selector] = eventEl.split(" ");
      const dom = this.shadow.querySelectorAll(selector);
      asyncForEach(dom, el => {
        el.addEventListener(event, handler);
      });
    });
  }

  connectedCallback() {
    this.view(state(model));
  }
}

export { Component };
