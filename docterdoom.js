"use strict";

var Cylon = require("cylon");

lastcommand = "";

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
        for (var i = 0; i < faces.length; i++) {
          var face = faces[i];
          im.rectangle(
            [face.x, face.y],
            [face.width, face.height],
            [255, 0, 0],
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





/*var opencv = require('node-python-opencv');*/

var commands = {};
commands["forward"] = "7100028080808001";
commands["backward"] = "7100828080808002";

commands["left"] = "7100808280808008";
commands["right"] = "7100800280808004";

commands["down"] = "7100808002808010";
commands["up"] = "7100808082808020";

commands["light"] = "7100808080800240";
commands["fire"] = "7100808080808280";

var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
btSerial.on('found', function(address, name) {
    console.log(address);
    btSerial.findSerialPortChannel(address, function(channel) {
        btSerial.connect(address, channel, function() {
            console.log(address);
            console.log('connected');

            btSerial.on('data', function(buffer) {
                //console.log(buffer);
            });
        }, function () {
            console.log('cannot connect');
        });

        // close the connection when you're ready
        btSerial.close();
    }, function() {
        console.log('found nothing');
    });
});

btSerial.inquire();

var sendCommand = function(command) {

    if (btSerial.isOpen()) {
        btSerial.write(new Buffer(command, 'hex'),
         function (err, bytesWritten) {
            if (err) console.log(err);});
    }
}

setInterval(function () {
        //console.log(lastcommand);
        if (lastcommand != "") {
                console.log("sending " + lastcommand);
                sendCommand(lastcommand);
        }
},450);

/*
var webcamdetector = new opencv.webcamdetector({
    port: 9010,
    useFastDetect : true
});
setTimeout(function () {
        console.log('ready');
    webcamdetector.findFaces({
            'haarcascade': 'face.xml',
            'scaleFactor': 1.2,
            'minNeighbors': 2
        }, function (data, err) {
            if (err)
                console.log("Error:" + err);
            else
            {
            // Return JSON object {faces: [{x: N, y: N, w: N, h: N}, ...]}
            console.log(JSON.stringify(data));
            if (data.faces[0])
            {
              var face = data.faces[0];
              var x = Number(face.x);
              var y = Number(face.y);
              var w = Number(face.w);
              var h = Number(face.h);

              console.log(x);
              if (w > 60 && h > 60) {
                      console.log('fire');
                      lastcommand = commands['fire'];
              }
              else if (x < 10)
                      lastcommand = commands['left'];
              else if (x > 90)
                      lastcommand = commands['right'];
              else
                      lastcommand = ""

            }
          }

        });
}, 5000);*/
