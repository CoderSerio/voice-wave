let audioTrack, audioElement, audioElement2, wave, canvasElement, recorder, recordButton;
let recordFlag = true;
let chunks = [];

audioElement = document.getElementById("audio");
audioElement2 = document.getElementById("audio2");
canvasElement = document.getElementById("canvas");
recordButton = document.getElementById("recordButton");

wave = new Wave(audioElement2, canvasElement);

wave.addAnimation(new wave.animations.Glob({
    fillColor: {gradient: ["red","blue","green"], rotate: 45},
    lineWidth: 10,
    lineColor: "#fff"
}));

wave.addAnimation(new wave.animations.Wave({
    lineWidth: 10,
    lineColor: "lightblue",
    count: 100
}));

function handleOnDataAvailable (e) {
    chunks.push(e.data);
}

function handleOnStop () {
    let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    let audioStream = URL.createObjectURL(blob);
        //估算时长
    // let duration = parseInt(blob.size / 6600);
    // if(duration <= 0) {
    //     alert('说话时间太短');
    //     return;
    // }
    // if(duration > 60) {
    //     duration = 60;
    // }
    audioElement2.src = audioStream;
    chunks = [];
}

function recordSwitch (e) {
    if (recordFlag) {
        recorder.start();
    } else {
        recorder.stop();
        setTimeout(() => {
            audioElement2.play().then(() => {});
        }, 0);
    }
    recordFlag =! recordFlag;
}

function stopRecord () {
}

navigator?.mediaDevices?.getUserMedia({audio: true}).then((mediastream) => {
    audioTrack = mediastream.getAudioTracks()[0];
    audioElement.srcObject = mediastream;
    
    recorder = new MediaRecorder(mediastream);
    recorder.ondataavailable = handleOnDataAvailable;
    recorder.onstop = handleOnStop;
    
    audioElement.play().then((e) => {
        // 成功捏
    }).catch((err) => {
        console.log(err);
    })
}).catch((err) => {
    console.log(err);
})