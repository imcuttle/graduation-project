/**
 * Created by moyu on 16/12/15.
 */
var cv = require('opencv');

var COLOR = [0, 255, 0]; // default red
var thickness = 2; // default 1

// console.log(1)

cv.readImage('../../gp-image-download/images/2013/191301/19130104.jpg', function(err, im) {
    if (err) throw err;
    if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
    // console.log(cv)
    im.detectObject('../data/haarcascade_eye.xml', {}, function(err, faces) {
        if (err) throw err;
        for (var i = 0; i < faces.length; i++) {
            face = faces[i];
            im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
            // im.rectangle([face.x, face.y], [face.width, face.height], COLOR, 2);
        }

        im.save('./face-detection-rectangle.png');
        console.log('Image saved to ./face-detection-rectangle.png');
    });

});

