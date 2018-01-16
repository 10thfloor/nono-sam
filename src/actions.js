const INC_COUNTER = Symbol("INC_COUNTER");

const actions = {
  [INC_COUNTER]: function(number) {
    return { counter: number };
  }
};

export { INC_COUNTER, actions };
