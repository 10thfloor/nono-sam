import escapeHTML from "../lib/escapeHTML.js";
import { actions } from "../src/actions.js";
import { model, present } from "../src/model.js";
import { state } from "../src/state.js";

const RenderMap = new Map();

class Component extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render = new Proxy(this.render, {
      apply: function(target, thisArg, argumentsList) {
        if (!RenderMap.get(argumentsList)) {
          RenderMap.set(argumentsList, target);
        }
        return target.apply(thisArg, argumentsList);
      }
    });
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
    for (let [eventEl, handler] of Object.entries(this.eventsObj)) {
      const [event, selector] = eventEl.split(" ");
      const dom = this.shadow.querySelectorAll(selector);
      dom.forEach(el => {
        el.addEventListener(event, handler);
      });
    }
  }

  connectedCallback() {
    this.view(state(model));
  }
}

export { Component };
