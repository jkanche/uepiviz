/**
 * @author Jayaram Kancherla
 * @email jayaram dot kancherla at gmail dot com
 * @create date 2020-12-01 01:39:13
 * @modify date 2020-12-01 01:39:13
 */

class GenomeTrack {
  constructor(options, target) {
    this.options = options;
    this.target = target;

    // canvas that renders the plot
    this.dataCanvas = document.createElement("canvas");
    this.dataCanvas.class = "dataCanvas";
    this.dataCanvas.style =
      "position:absolute;top:0;left:0;width:100%;height:100%";
    this.dataCanvas.style.height = this.options.height;
    this.dataCanvas.style.width = this.options.width;

    this.dataCanvas.height = this.options.height;
    this.dataCanvas.width = this.options.width;

    document.querySelector(target).appendChild(this.dataCanvas);

    // canvas for mouse over interactions and brushing
    this.hoverCanvas = document.createElement("canvas");
    this.hoverCanvas.class = "hoverCanvas";
    this.hoverCanvas.style =
      "position:absolute;top:0;left:0;width:100%;height:100%;z-index:1";
    this.hoverCanvas.style.height = this.options.height;
    this.hoverCanvas.style.width = this.options.width;

    this.hoverCanvas.height = this.options.height;
    this.hoverCanvas.width = this.options.width;

    document.querySelector(target).appendChild(this.hoverCanvas);

    this.dataOffscreen = this.dataCanvas.transferControlToOffscreen();
    // new OffscreenCanvas(this.options.width, this.options.height);

    this.getAxes();
    // this.addCanvasEvents();
  }

  getAxes() {
    const margins = this.options.margins,
      height = this.options.height,
      width = this.options.width;

    if (this.options.axes.X.show) {
      // TODO: create my own scales
      this.xScale = d3
        .scaleLinear()
        .domain(this.options.axes.X.domain)
        .range([margins.left, width - margins.right]);
    }

    if (this.options.axes.Y.show) {
      // TODO: create my own scale
      this.yScale = d3
        .scaleLinear()
        .domain(this.options.axes.Y.domain)
        .range([height - margins.bottom, margins.top]);
    }
  }

  // TODO: split this up so that
  // data and axes are rendered separately
  render(data) {
    var self = this;
    // console.log("in data");
    var rWorker = new Worker("/src/renderWorker.js");

    if (!data) {
      data = 1;
    }

    rWorker.postMessage(
      {
        canvas: this.dataOffscreen,
        data: data,
        options: this.options,
      },
      [this.dataOffscreen]
    );

    // TODO: may be if i don't use workers
    // automatic shared scope
    // rWorker.onmessage = function (e) {
    //     console.log("track comes back");
    //   self.track = e.data.track;
    //   self.addCanvasEvents();
    // };

    rWorker.addEventListener("message", function(e) {
        // console.log(e);

        if (e.data.type == "trackRendered") {
            self.track = e.data.track;
            self.addCanvasEvents();
        }
    })
  }

  // TODO: support drag and drop
  addCanvasEvents() {
    var self = this;
    // console.log("hmm I guess I should add interactions");

    const margins = this.options.margins,
      height = this.options.height,
      width = this.options.width,
      minHighlightSize = 5;

    // MouseOver
    var hctx = self.hoverCanvas.getContext("2d");
    self.hoverCanvas.addEventListener("mousemove", function (e) {
      // console.log("mouseout");

      //   var rect = self.hoverCanvas.getBoundingClientRect();

      //   console.log(rect);
      var x = e.offsetX; //- margins.left - margins.right;
      //   console.log(e);
      //   var y = e.offsetY;

      var start = self.xScale.invert(x) - 10,
        end = self.xScale.invert(x) + 10;

      //   console.log(start, end);
      hctx.clearRect(0, 0, self.hoverCanvas.width, self.hoverCanvas.height);

      hctx.fillStyle = self.options.colors[0];
      hctx.globalAlpha = 0.1;
      var defaultWidth = 10; //self.xScale(end) - self.xScale(start);
      var twidth = Math.max(minHighlightSize, defaultWidth);
      //   x = x - margins.left + margins.right;
      //   var x = self.xScale(start) - width * 0.5;

      // TODO: things need to change if
      //   I want to highlight points as well
      
      // draw bounding region   
      hctx.fillRect(
        x,
        margins.top,
        twidth,
        height - margins.top - margins.bottom
      );

      // highlight points in this region
        //   var region = 
        // console.log(self.track.items);
    });

    self.hoverCanvas.addEventListener("mouseout", function (e) {
      // console.log("mouseout");
      hctx.clearRect(0, 0, self.hoverCanvas.width, self.hoverCanvas.height);
    });
  }
}