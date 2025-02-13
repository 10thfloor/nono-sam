import { actions } from "../src/actions.js";
import { present } from "../src/model.js";
import { state } from "../src/state.js";
import { createModel } from "../src/model.js";
import escapeHTML from "./escapeHTML.js";

class Component extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.model = createModel();
		this._boundEventHandlers = new Map();
		this._pendingUpdate = null;
	}

	action(name, data) {
		return () => {
			const newModel = present(this.model, actions[name](data));
			this.model = newModel;
			this._scheduleUpdate(state(newModel));
		};
	}

	_scheduleUpdate(viewState) {
		if (this._pendingUpdate) {
			cancelAnimationFrame(this._pendingUpdate);
		}
		this._pendingUpdate = requestAnimationFrame(() => {
			queueMicrotask(() => {
				this.view(viewState);
				this._pendingUpdate = null;
			});
		});
	}

	events(eventsObj) {
		this.eventsObj = eventsObj;
	}

	view(viewState) {
		Promise.resolve().then(() => {
			this._removeEventListeners();
			this.shadow.innerHTML = this.render(viewState);
			this._attachEventListeners();
		});
	}

	_removeEventListeners() {
		if (this._boundEventHandlers.size === 0) return;

		queueMicrotask(() => {
			for (const [element, handlers] of this._boundEventHandlers.entries()) {
				for (const [event, handler] of handlers) {
					element.removeEventListener(event, handler);
				}
			}
			this._boundEventHandlers.clear();
		});
	}

	_attachEventListeners() {
		queueMicrotask(() => {
			for (const [eventEl, handler] of Object.entries(this.eventsObj)) {
				const [event, selector] = eventEl.split(" ");
				const elements = this.shadow.querySelectorAll(selector);
				for (const element of elements) {
					const boundHandler = (e) => {
						Promise.resolve()
							.then(() => handler.call(this, e))
							.catch((error) => console.error("Event handler error:", error));
					};
					if (!this._boundEventHandlers.has(element)) {
						this._boundEventHandlers.set(element, new Map());
					}
					this._boundEventHandlers.get(element).set(event, boundHandler);
					element.addEventListener(event, boundHandler);
				}
			}
		});
	}

	disconnectedCallback() {
		this._removeEventListeners();
	}

	connectedCallback() {
		this.view(state(this.model));
	}

	html(strings, ...values) {
		return strings.reduce((result, string, i) => {
			const value = values[i] != null ? values[i] : "";
			// Automatically escape values unless they're explicitly marked as safe
			const safeValue =
				value instanceof SafeHTML ? value.toString() : escapeHTML(value);
			return result + string + safeValue;
		}, "");
	}

	// Helper to mark HTML as safe (for when you need to insert raw HTML)
	safe(html) {
		return new SafeHTML(html);
	}
}

// Simple class to mark safe HTML content
class SafeHTML {
	constructor(content) {
		this._content = content;
	}

	toString() {
		return this._content;
	}
}

export { Component };
