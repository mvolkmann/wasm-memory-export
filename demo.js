async function run() {
  const imports = {
    js: {
      log(arg) {
        console.log('from WASM,', arg);
      }
    }
  };
  const m = await WebAssembly.instantiateStreaming(fetch('demo.wasm'), imports);
  const {myMemory, translatePoints} = m.instance.exports;

  const points = [
    {x: 1.2, y: 2.3},
    {x: 3.4, y: 4.5},
    {x: 5.6, y: 6.7}
  ];

  // Copy the point data into linear memory shared with WASM code.
  const offset = 0;
  const length = points.length * 2;
  const array = new Float64Array(myMemory.buffer, offset, length);
  let index = 0;
  for (const point of points) {
    array[index++] = point.x;
    array[index++] = point.y;
  }

  console.log('untranslated points =', array);
  translatePoints(points.length, 2, 3);
  console.log('translated points =', array);
}

run();
