onmessage = function(evt) {
    const canvas = evt.data.canvas;
    const data = evt.data.data;
    const options = evt.data.options;
    
    console.log("in worker, data", data);

    // const ctx = canvas.getContext("2d");

    function render(time) {
        // ctx.font = '48px serif';
        // ctx.fillText('Hello world', 10, 50);  
        importScripts("plugins/charts/GWASTrack.js");

        // TODO: totally unnecessary, implement own axes scale and tick methods
        importScripts("https://d3js.org/d3.v6.js")

        var gwas = new GWASTrack(options, canvas);
        gwas.render(data);
    }
      
    requestAnimationFrame(render);
};