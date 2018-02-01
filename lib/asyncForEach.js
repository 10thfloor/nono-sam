// https://h3manth.com/content/async-foreach-javascript
export default function(array, fn) {
  let i = 0;
  const maxBurnTime = 100; // ms to run before yielding to user agent

  function iter() {
    const startTime = Date.now();

    while (i < array.length) {
      fn.call(array, array[i], i++);
      if (Date.now() - startTime > maxBurnTime) {
        return setTimeout(iter, 0);
      }
    }
  }
  setTimeout(iter, 0);
}
