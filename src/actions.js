const INC_COUNTER = Symbol("INC_COUNTER");
const RESET_COUNTER = Symbol("RESET_COUNTER");

const actions = {
	[INC_COUNTER]: (number) => ({ type: INC_COUNTER, amount: number }),
	[RESET_COUNTER]: () => ({ type: RESET_COUNTER }),
};

export { INC_COUNTER, RESET_COUNTER, actions };
