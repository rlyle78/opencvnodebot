"use strict";

var Cylon = require("cylon");
var cv = require('opencv');
console.log("Started Training");
var trainingData = [];
/*for (var i = 0; i< 243; i++){
    trainingData.push([0,"ron/" + i + ".jpg" ]);
}*/

for (var i = 0; i< 1; i++){
  for (var j = 0; j<243; j++){
    trainingData.push([i,"ModelsFaceDetections/" + i + "/" + j + ".jpg"]);
     //trainingData.push([i,"/Users/peterbraden/Downloads/orl_faces/s" + i + "/" + j + ".pgm" ])
  }
}


Cylon.robot({
  connections: {
    opencv: { adaptor: "opencv" }
  },

  devices: {
    window: { driver: "window" },
    camera: {
      driver: "camera",
      camera: 0,
      haarcascade: "haarcascade_frontalface_alt.xml"
    }
  },

  work: function(my) {

    var facerec = cv.FaceRecognizer.createEigenFaceRecognizer();
    facerec.trainSync(trainingData);
    console.log("Done Training")

    // We setup our face detection when the camera is ready to
    // display images, we use `once` instead of `on` to make sure
    // other event listeners are only registered once.
    my.camera.once("cameraReady", function() {
      console.log("The camera is ready!");

      // We add a listener for the facesDetected event
      // here, we will get (err, image/frame, faces) params back in
      // the listener function that we pass.
      // The faces param is an array conaining any face detected
      // in the frame (im).
      my.camera.on("facesDetected", function(err, im, faces) {
        if (err) { console.log(err); }

        // We loop through the faces and manipulate the image
        // to display a square in the coordinates for the detected
        // faces.
        var img_gray = im.copy();
        img_gray.convertGrayscale();
        for (var i = 0; i < faces.length; i++) {
          var face = faces[i];

          var img_crop = img_gray.crop(face.x,face.y,face.width,face.height)
          img_crop.resize(60,60, 1);
          //img_crop.save('face' + i + '.jpg');
          console.log(facerec.predictSync(img_crop));
          
          im.rectangle(
            [face.x, face.y],
            [face.width, face.height],
            [0, 255, 0],
            2
          );
        }

        // The second to last param is the color of the rectangle
        // as an rgb array e.g. [r,g,b].
        // Once the image has been updated with rectangles around
        // the faces detected, we display it in our window.
        my.window.show(im, 40);

        // After displaying the updated image we trigger another
        // frame read to ensure the fastest processing possible.
        // We could also use an interval to try and get a set
        // amount of processed frames per second, see below.
        my.camera.readFrame();
      });

      // We listen for frameReady event, when triggered
      // we start the face detection passing the frame
      // that we just got from the camera feed.
      my.camera.on("frameReady", function(err, im) {
        if (err) { console.log(err); }
        im.resize(320,240);
        my.camera.detectFaces(im);
      });

      my.camera.readFrame();
    });
  }
}).start();
