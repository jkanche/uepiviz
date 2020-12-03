/**
 * @author Jayaram Kancherla
 * @email jayaram dot kancherla at gmail dot com
 * @create date 2020-12-02 19:26:00
 * @modify date 2020-12-02 19:26:00
 */
opts = {
  height: 200,
  width: 1000,
  render: "canvas",

  track: {
    trackType: "GWAS",
    showLines: false,
    showPoints: true,
    pointRadius: 1,
    interpolation: "basis",
  },

  axes: {
    X: {
      show: true,
      domain: [100000, 200000],
      chrom: "chr12",
      field: "start",
    },
    Y: {
      show: true,
      domain: [0, 100],
      field: "value",
    },
  },

  margins: {
    left: 50,
    right: 25,
    top: 25,
    bottom: 25,
  },

  colors: [
    "blue",
    "orange",
    "green",
    "red",
    "yellow",
    "cyan",
    "purple",
    "grey",
  ],
};

var track = new GenomeTrack(opts, ".chart1000");
track.render(100);
