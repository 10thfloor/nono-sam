const state = (model) => {
	const state = { counter: model.counter || 0 };
	return state;
};

export { state };
