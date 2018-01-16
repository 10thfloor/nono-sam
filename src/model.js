import { state } from "./state.js";

let model = {
  counter: 0
};

const present = data => {
  try {
    let update = accept(data);
    model = Object.assign(model, update);
    return model;
  } catch (e) {
    console.log(e);
  }
};

function accept(data) {
  if (data.counter) {
    return { counter: model.counter + data.counter };
  }
  return model;
}

export { model, present };
