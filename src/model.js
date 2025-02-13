export function createModel() {
	return { counter: 0 };
}

export const present = (model, data) => {
	try {
		const update = accept(model, data);
		return Object.assign({}, model, update);
	} catch (e) {
		console.log(e);
		return model;
	}
};

function accept(model, data) {
	// Do we accept the action?
	if (data.amount) {
		return { counter: model.counter + data.amount };
	}
	return model;
}
