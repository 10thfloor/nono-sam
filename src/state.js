import { StateManager } from "../lib/StateManager.js";

export const stateManager = new StateManager({
	tasks: ["task1", "task2", "task3"],
	users: ["user1", "user2", "user3"],
	preferences: {
		theme: "light",
		language: "en",
	},
});
