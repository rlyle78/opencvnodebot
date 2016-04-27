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

var facerec = cv.FaceRecognizer.createEigenFaceRecognizer();
facerec.trainSync(trainingData);
console.log("Done Training")

console.log("Recognizing...")

console.log("video")
video_stream = new cv.VideoCapture(0);
var window = new cv.NamedWindow('Video', 0)

video_stream.read(function(err, im0){
    var x = 0;
    var iter = function(){
        video_stream.read(function(err, im){
        if (err) throw err;

        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');


        im.detectObject("haarcascade_frontalface_alt.xml", {}, function(err, faces){
          if (err) throw err;

          img_gray = im.copy();
          img_gray.convertGrayscale();

          for (var i = 0; i < faces.length; i++)
          {
            var face = faces[i];
            img_crop = img_gray.crop(face.x,face.y,face.width,face.height)
            img_crop.resize(60,60, 1);
            //img_crop.save('face' + i + '.jpg');
            console.log(facerec.predictSync(img_crop));
            im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
          }

          window.show(im);
          window.blockingWaitKey(0, 500);
        })

        x++;
        iter();
        /*if (x>100) {
            console.log('done');
            video_stream.readable = false;
        }
        else {
         iter();
       }*/
    })
  }
  iter();
});
