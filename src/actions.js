const INC_COUNTER = Symbol("INC_COUNTER");

const actions = {
	[INC_COUNTER]: (number) => ({ amount: number }),
};

export { INC_COUNTER, actions };
