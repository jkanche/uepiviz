/**
 * @author Jayaram Kancherla
 * @email jayaram dot kancherla at gmail dot com
 * @create date 2020-12-01 01:39:13
 * @modify date 2020-12-01 01:39:13
 */

 onmessage = function (e) {
  const canvas = e.data.canvas;
  const data = e.data.data;
  const options = e.data.options;

  console.log("in worker, data", data);

  function render(time) {
    importScripts("plugins/charts/GWASTrack.js");

    // TODO: totally unnecessary, implement own axes scale and tick methods
    importScripts("https://d3js.org/d3.v6.js");

    var track = new GWASTrack(options, canvas);
    track.render(data);

    postMessage({
      type: "trackRendered", 
      track: new ArrayBuffer(track)
    });
  }

  requestAnimationFrame(render);
};
