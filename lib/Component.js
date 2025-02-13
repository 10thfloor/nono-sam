import { actions } from "../src/actions.js";
import escapeHTML from "./escapeHTML.js";

class SAMComponent extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.model = this.createModel();
		this._boundEventHandlers = new Map();
		this._pendingUpdate = null;
	}

	action(name, data) {
		return async () => {
			const newModel = await this.present(this.model, actions[name](data));
			this.model = newModel;
			const stateRepresentation = this.computeState(newModel);
			this._scheduleUpdate(stateRepresentation);
		};
	}

	// Default model creation if not defined in component
	createModel() {
		return {};
	}

	// Default accept if not defined in component
	accept(model, action) {
		return model;
	}

	// Default component state if not defined in component
	computeState(model) {
		return { ...model };
	}

	async present(model, data) {
		try {
			// Use component's accept method
			const update = this.accept(model, data);
			const newModel = Object.assign({}, model, update);

			return new Promise((resolve) => {
				queueMicrotask(async () => {
					// Use component's NAP rules
					const napResult = await this.nap(newModel);
					resolve(napResult || newModel);
				});
			});
		} catch (e) {
			console.log(e);
			return Promise.resolve(model);
		}
	}

	nap(model) {
		return new Promise((resolve) => {
			for (const rule of this.napRules) {
				const action = rule(model);
				if (action) {
					const proposal = actions[action.type]?.(action.data);
					if (proposal) {
						resolve(this.accept(model, { type: action.type, ...proposal }));
						return;
					}
					break;
				}
			}
			resolve(null);
		});
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
		this.view(this.computeState(this.model));
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

export { SAMComponent };
