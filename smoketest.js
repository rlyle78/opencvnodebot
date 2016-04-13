var cv = require('opencv');


var trainingData = [];
/*for (var i = 0; i< 243; i++){
    trainingData.push([0,"ron/" + i + ".jpg" ]);
}*/

for (var i = 0; i< 4; i++){
  for (var j = 0; j<81; j++){
    trainingData.push([i,"ModelsFaceDetections/" + i + "/" + j + ".jpg"]);
     //trainingData.push([i,"/Users/peterbraden/Downloads/orl_faces/s" + i + "/" + j + ".pgm" ])
  }
}


var facerec = cv.FaceRecognizer.createEigenFaceRecognizer();
facerec.trainSync(trainingData);

video_stream = new cv.VideoCapture(0);
video_stream.read(function(err, im0){
    var x = 0;
    var iter = function(){
        video_stream.read(function(err, im){
        
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
    
            im.detectObject("haarcascade_frontalface_alt.xml", {}, function(err, faces){
                if (err) throw err;
                
                img_gray = im.copy();
                img_gray.convertGrayscale();
                
                for (var i = 0; i < faces.length; i++){
                var face = faces[i];
                img_crop = img_gray.crop(face.x,face.y,face.width,face.height)
                img_crop.resize(60,60, 1);
                img_crop.save( + x + '.jpg');
                console.log(facerec.predictSync(img_crop));
                //im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
                }
            })
    
        x++;
        if (x>100) {
            console.log('done');
            video_stream.readable = false;
        }
        else {   
         iter();
        }
    })
  }
  iter();
});


/*cv.readImage("./examples/files/mona.png", function(e, mat){
  var th = mat.threshold(200, 200, "Threshold to Zero Inverted");
  th.save('./examples/tmp/out.png');
});*/
