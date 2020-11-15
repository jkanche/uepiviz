class GenomeTrack {
    constructor(options, target) {
        this.options = options;
        this.target = target;

        this.elem = document.createElement("canvas");
        this.elem.style.height = this.options.height;
        this.elem.style.width = this.options.width;

        this.elem.height = this.options.height * 1.5;
        this.elem.width = this.options.width * 1.5;

        document.querySelector(target).appendChild(this.elem);

        this.offscreen = this.elem.transferControlToOffscreen();
        // new OffscreenCanvas(this.options.width, this.options.height);
    }

    render(data) {
        console.log("in data")
        var rWorker = new Worker("src/renderWorker.js");

        rWorker.postMessage(
            {
                canvas: this.offscreen,
                data: data,
                options: this.options
            },
            [this.offscreen]
        )
    }
}

opts = {
    height: 800,
    width: 1600,

    render: "canvas",
    trackType: "GWAS",

    axes: {
        X: {
            show: true,
            domain: [100000, 200000]
        },
        Y: {
            show: true,
            domain: [0, 100]
        }
    },

    margins: {
        left: 25,
        right: 25,
        top: 25, 
        bottom: 25
    }
}

var track = new GenomeTrack(opts, "#chart")
track.render({})