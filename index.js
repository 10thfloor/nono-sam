import { Hello } from "./src/component.js ";

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
