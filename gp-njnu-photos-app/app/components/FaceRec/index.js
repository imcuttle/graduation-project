import React from 'react'
import {Map} from 'immutable'
import css from './style.less'
require('../../workers/face.worker');

var worker = new Worker('./workers/face.worker.js')

const tracking = window.tracking

/**
 * Tracks the `Video` frames. This method is called for each video frame in
 * order to emit `track` event.
 * @param {Uint8ClampedArray} pixels The pixels data to track.
 * @param {number} width The pixels canvas width.
 * @param {number} height The pixels canvas height.
 *
 * override track method, Use WebWorker
 */
tracking.ObjectTracker.prototype.track = function(pixels, width, height) {
    var self = this;
    var classifiers = this.getClassifiers();

    if (!classifiers) {
      throw new Error('Object classifier not specified, try `new tracking.ObjectTracker("face")`.');
    }


    var tosend = [pixels, width, height, self.getInitialScale(), self.getScaleFactor(), self.getStepSize(), self.getEdgesDensity()]
    worker.postMessage(tosend)

    // var results = [];

    // classifiers.forEach(function(classifier) {
    //   results = results.concat(tracking.ViolaJones.detect(pixels, width, height, self.getInitialScale(), self.getScaleFactor(), self.getStepSize(), self.getEdgesDensity(), classifier));
    // });

    // this.emit('track', {
    //   data: results
    // });
};



export default class extends React.Component {

    constructor(props) {
        super(props);
        this.doRectData = this.doRectData.bind(this)
        this.videoPlay = this.videoPlay.bind(this)
    }

    videoPlay() {
        const {canvas, video, img, container, data_canvas} = this
        var context = canvas.getContext('2d');
        const self = this

        // 
        var tracker = new tracking.ObjectTracker("face");
        tracker.setInitialScale(1.95);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);

        worker.onmessage = function(event) {
            if(this.unmount) return;
            tracker.emit('track', event);
        }
        tracking.track(video, tracker, { camera: true });
        
        tracker.on('track', function(event) {
            if(this.unmount) return;
            canvas.width = video.clientWidth
            canvas.height = video.clientHeight

            container.style.height = video.clientHeight+30+'px'

            context.clearRect(0, 0, canvas.width, canvas.height);
            event.data.forEach(function(rect, i) {
              context.strokeStyle = '#a64ceb';
              context.strokeRect(rect.x, rect.y, rect.width, rect.height);
              context.font = '11px Helvetica';
              context.fillStyle = "#fff";
              context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
              context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

              if(i === 0) {
                self.doRectData(rect)
              }
            });
        });
    }

    componentWillUnmount() {
        this.unmount = true
    }

    componentDidMount() {
        this.unmount = false
        this.videoPlay()
        
    }

    doRectData(rect) {
        const {onDataCallback} = this.props
        const {data_canvas, video, img} = this
        if(!data_canvas) {
            return;
        }
        const ctx = data_canvas.getContext('2d')
        var bound = 200;
        var x = rect.x-bound;
        var y = rect.y-bound;
        var w = rect.width+bound;
        var h = rect.height+bound;
        x = x>=0?x:0;
        y = y>=0?y:0;
        w = (w>video.clientWidth?video.clientWidth:w);
        h = (h>video.clientHeight?video.clientHeight:h);

        data_canvas.width = w;
        data_canvas.height = h;
        console.log('Rect', x, y, w, h);
        ctx.drawImage(video, x, y, w, h, 0, 0, w, h)
        // ctx.drawImage(video, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height)

        // img.width = video.clientWidth;
        // img.height = video.clientHeight

        const data = data_canvas.toDataURL('image/jpeg', 1.0)
        onDataCallback && onDataCallback(data)

    }

    render() {
        const {text="拍照", onDataCallback, data, interval=5} = this.props
        return (
            <div className={css.main}>
                <div className={css.content} ref={r=>this.container=r}>
                    <video ref={r=>this.video=r} preload={true} autoPlay={true} loop={true} muted={true}/>
                    <canvas style={{display: ''}} ref={r=>this.canvas=r} />
                    {/*<img ref={r=>this.img=r} src={data}/>*/}
                    <canvas style={{display: 'none'}} ref={r=>this.data_canvas=r} />
                </div>
            </div>
        )
    }
}
