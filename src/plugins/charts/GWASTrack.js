/**
 * @author Jayaram Kancherla
 * @email jayaram dot kancherla at gmail dot com
 * @create date 2020-12-01 01:39:13
 * @modify date 2020-12-01 01:39:13
 */

class GWASTrack {
  constructor(options, canvas) {
    this.options = options;
    this.canvas = canvas;

    this.renderAxes();
  }

  // TODO: finish this later, use d3-scale for now
  getTicks(domain, nticks) {
    var range = domain[1] - domain[0],
      step = range / nticks;

    const margins = this.options.margins,
      height = this.options.height,
      width = this.options.width;

    tickMarks = [];
    // for (var i=0; i < nticks; i++) {
    // }

    return;
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  renderAxes() {
    var self = this;

    const margins = this.options.margins,
      height = this.options.height,
      width = this.options.width;

    // TODO: move this to options
    const nticks = 5;

    var ctx = this.canvas.getContext("2d");
    // TODO: define axes width in options
    ctx.lineWidth = 1;

    if (this.options.axes.X.show) {
      // TODO: create my own scales
      this.xScale = d3
        .scaleLinear()
        .domain(this.options.axes.X.domain)
        .range([margins.left, width - margins.right]);

      // draw axes & grid
      ctx.beginPath();
      ctx.strokeStyle = "black";

      // x-axis line
      ctx.moveTo(margins.left, height - margins.bottom);
      ctx.lineTo(width - margins.right, height - margins.bottom);
      ctx.stroke();

      //x-axis grid and ticks
      var xTicks = this.xScale.ticks(nticks);
      xTicks.forEach(function (tick) {
        ctx.beginPath();
        ctx.moveTo(self.xScale(tick), height - margins.bottom);
        ctx.lineTo(self.xScale(tick), height - margins.bottom + 6);
        // TODO: define color in options
        ctx.strokeStyle = "#565656";
        ctx.stroke();

        ctx.moveTo(self.xScale(tick), height - margins.bottom);
        ctx.lineTo(self.xScale(tick), margins.top);
        // TODO: define stroke in options
        ctx.strokeStyle = "#dcdcdc";
        ctx.stroke();
      });

      //x-scale labels
      ctx.beginPath();
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      var xAxisTickFormat = function (x) {
        var format = d3.format("s");
        var rounded = Math.round(x * 1000) / 1000;
        return format(rounded);
      };

      var xUnits = xTicks.map(xAxisTickFormat);

      xUnits.forEach(function (unit, i) {
        ctx.fillText(unit, self.xScale(xTicks[i]), height - margins.bottom + 8);
      });

      ctx.stroke();
    }

    if (this.options.axes.Y.show) {
      // TODO: create my own scale
      this.yScale = d3
        .scaleLinear()
        .domain(this.options.axes.Y.domain)
        .range([height - margins.bottom, margins.top]);

      // TODO: should I translate to make this easier ?
      // ctx.translate(this.margins().left(), this.margins().top());

      ctx.beginPath();
      ctx.strokeStyle = "black";

      // y-axis line
      ctx.moveTo(margins.left, height - margins.bottom);
      ctx.lineTo(margins.left, margins.top);
      ctx.stroke();

      //y-axis grid and ticks
      var yTicks = this.yScale.ticks(nticks);
      yTicks.forEach(function (tick) {
        ctx.beginPath();
        ctx.moveTo(margins.left, self.yScale(tick));
        ctx.lineTo(margins.left - 6, self.yScale(tick));
        ctx.strokeStyle = "#565656";
        ctx.stroke();

        ctx.moveTo(margins.left, self.yScale(tick));
        ctx.lineTo(width - margins.right, self.yScale(tick));
        ctx.strokeStyle = "#dcdcdc";
        ctx.stroke();
      });

      ctx.stroke();
      ctx.beginPath();
      //y-scale labels
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      var yAxisTickFormat = function (y) {
        var format = d3.format("s");
        var rounded = Math.round(y * 1000) / 1000;
        return format(rounded);
      };

      var yUnits = yTicks.map(yAxisTickFormat);

      yUnits.forEach(function (unit, i) {
        ctx.fillText(unit, margins.left - 8, self.yScale(yTicks[i]));
      });

      ctx.stroke();
    }

    ctx.save();
  }

  x(j) {
    var self = this;
    return self.xScale(j[self.options.axes.X.field]);
  };

  y(j) {
    var self = this;
    return self.yScale(j[self.options.axes.Y.field]);
  };

  render(data) {
    console.log(data);

    if (!data) {
      console.log("data is empty");
      // generate data the length of the domain

      var dstart = this.options.axes.X.domain[0],
        dend = this.options.axes.X.domain[1];

      data = [];

      for (var i = dstart; i < dend; i = i + 50) {
        data.push({
          start: i,
          end: i + 1,
          value: this.getRandom(40, 60),
        });
      }
    }
    var self = this;

    // TODO: move to options
    var colors = this.options.colors;
    var lineThickness = 1;
    // var interpolation = "basis";

    var ctx = this.canvas.getContext("2d");
    this.items = {};

    // TODO: if drawing multiple series, use the appropriate index
    var color = colors[0];

    if (this.options.track.showLines) {
      // TODO: make smoothing a param
      var line = d3.line().x(self.x.bind(self)).y(self.y.bind(self)).curve(d3.curveBasis);

      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      // ctx.save();
      // draw items on  canvas
      // TODO: use renderingQueues for optimizing large draws
      var path = new Path2D(line(data));
      ctx.strokeStyle = color;
      ctx.lineWidth = lineThickness;
      ctx.stroke(path);
      // ctx.fill(path);
      ctx.beginPath();
    }

    ctx.save();

    if (this.options.track.showPoints) {
      data.forEach(function (d) {
        var xpoint = self.x(d);
        var ypoint = self.y(d);

        if (self.items[Math.floor(xpoint)]) {
          self.items[Math.floor(xpoint)].push(d);
        } else {
          self.items[Math.floor(xpoint)] = [d];
        }

        ctx.beginPath();
        ctx.arc(xpoint, ypoint, self.options.track.pointRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
        // ctx.endPath();
        ctx.fillStyle = color;
        ctx.fill();
      });
    }

    ctx.save();
  }
}
