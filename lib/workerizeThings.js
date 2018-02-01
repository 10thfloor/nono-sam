export default renderFunc => renderFuncArgs => () => {
  let worker = new Worker(
    URL.createObjectURL(
      new Blob([
        `onmessage=((fn => e => {
            fn.apply(fn, e.data);
        })(${renderFunc}))`
      ])
    )
  );
  renderFuncArgs = [].slice.call(arguments);
  worker.postMessage(renderFuncArgs);
};
