/**
 * Created by moyu on 16/12/15.
 */
var camera, color, cv, intervalId, namedWindow;

cv = require('opencv');

camera = new cv.VideoCapture(1);

namedWindow = new cv.NamedWindow('Video', 1);

color = [255, 0, 0];

intervalId = setInterval(function() {
    return camera.read(function(err, im) {
        var res;
        if (err) {
            console.log("The err ==>" + err);
        }
        if (im.width() > 0 && im.height() > 0) {
            im.detectObject('./haarcascades/haarcascade_frontalface_alt.xml', {}, function(err, faces) {
                var face, i, len;
                for (i = 0, len = faces.length; i < len; i++) {
                    face = faces[i];
                    im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], [0, 255, 0], 2);
                }
                return namedWindow.show(im);
            });
        }
        res = namedWindow.blockingWaitKey(0, 50);
        if (res >= 0) {
            return clearInterval(intervalId);
        }
    });
}, 150);