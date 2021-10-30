// VARIABLES
let video = document.getElementById("video");
let recordedVideo = document.getElementById("recorded");
let btnRecord = document.getElementById("record")
let btnPlay = document.getElementById("play")
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let c2 = document.getElementById("frame");
let ctx2 = c2.getContext("2d");
let c3 = document.getElementById("mouth");
let ctx3 = c3.getContext("2d");
let model;
let faro = 0;
let date = null;
let interval=2000;
let posxMouth;
let posyMouth;

let mediaRecorder;
let recordedFrames;

let pictures;
let fd2;
let ind;

// STREAM VIDEO
const setupCamera = () => {
    navigator.mediaDevices.getUserMedia({
        video: {width: 600, heigth: 400},
        audio: false, 
    }).then((stream) => {
        video.srcObject = stream; 
    });
};



// PREDICT
const faceDetection = async () => {
    const prediction = await model.estimateFaces(video, false);
    
    ctx.drawImage(video, 0, 0, 600,400);
    let posx=prediction[0].topLeft[0];
    let posy=prediction[0].topLeft[1];
    let widthc = prediction[0].bottomRight[0] - posx;
    let heightc = prediction[0].bottomRight[1] - posy;
    //console.log(widthc, heightc)
    //ctx.drawImage(video, posx, posy, widthc, heightc, 0, 0, 1, 1);
    prediction.forEach( (element) => {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "blue";
        ctx.rect(
            element.topLeft[0],
            element.topLeft[1]-10,
            element.bottomRight[0] - element.topLeft[0],
            element.bottomRight[1] - element.topLeft[1],
        );
        ctx.stroke();
        ctx.fillStyle = "red";
        landmark = prediction[0].landmarks[2]
        posxMouth = landmark[0]
        posyMouth = landmark[1]
        ctx.fillRect(posxMouth, posyMouth, 5, 5);
        //prediction[0].landmarks.forEach((landmark) => {
        //    ctx.fillRect(landmark[0], landmark[1], 5, 5);
        //})  

    });

    var imageData = ctx.getImageData(prediction[0].topLeft[0], prediction[0].topLeft[1]-10, prediction[0].bottomRight[0], prediction[0].bottomRight[1]);
    var newCan = document.getElementById('frame');
    newCan.width = widthc;
    newCan.height = heightc;
    var newCtx = newCan.getContext('2d');

    var mouthData = ctx.getImageData(posxMouth-35, posyMouth-20, posxMouth+35, posyMouth+25);
    c3.width = 70;
    c3.height = 45;

    if (faro==1){
        const currentDate = Date.now();
        newCtx.putImageData(imageData, 0, 0);
        ctx3.putImageData(mouthData, 0, 0);
        //pictures.push(c3.toDataURL("image/png"));
        c3.toBlob(function(blob) {
            fd2.append('json'+ind, blob, "image"+ind+".png");
            ind += 1;
        });
        //console.log(c3.toDataURL("image/png"));
        if (currentDate - date > interval){
            sendPictures()
            faro = 0;
        }
    }
  
};

setupCamera();

// DEFINE MODEL
video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
    //model = await tf.loadLayersModel('model_web/model.json');
    setInterval(faceDetection, 100) ;
});

function takepicture() {
    ind = 1;
    faro = 1;
    pictures = []
    date = Date.now();
}

btnRecord.addEventListener("click", (ev) => {
    fd2 = new FormData();
    takepicture();
})

async function sendPictures(){

    //const fd = new FormData();
    //for(i=0;i< pictures.length;i++){
     //   fd.append('json'+i, pictures[i])
        //console.log(pictures[i].data)
    //}
    //console.log(fd2)
    fd2.append("text", ind-1);
    
    var url='http://127.0.0.1:8080/predict';
            await axios.post(url, fd2)
            .then(function(res){
                console.log(res.data)
                if(res.data.status==201)
                    console.log("exitos")
                })
            .catch(function(err){
                console.log(err)
            })
            .then(function(){
                console.log("Finish")
            })
}