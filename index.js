import { Hello } from "./src/component.js ";
import { stateManager } from "./src/state.js";
import { SAMComponent } from "./lib/Component.js";

SAMComponent.stateManager = stateManager;

const components = new Map([["hello-world", Hello]]);

for (const [name, component] of components) {
	customElements.define(name, component);
}

if (!("serviceWorker" in navigator)) {
	console.log("Service worker not supported");
} else {
	navigator.serviceWorker
		.register("service-worker.js")
		.then(() => {
			console.log("Service Worker Registered");
		})
		.catch((error) => {
			console.log("Service Worker Registration failed:", error);
		});
}
