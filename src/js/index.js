import "../style/style.css";
import WebcamEasy from 'webcam-easy';

// tensorflow imports
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";

// Functional elements
const webcamElement = document.querySelector('#webcam');
const canvasElement = document.querySelector('#canvas');
const snapSoundElement = document.querySelector('#snapSound');

// User interaction elements
const btnStart = document.querySelector('.button.start');
const btnStream = document.querySelector('.button.stream');
const btnFacemesh = document.querySelector('.button.facemesh');
const btnStop = document.querySelector('.button.stop');

// WebcamEasy instance
const webcam = new WebcamEasy(webcamElement, 'user', canvasElement, snapSoundElement);

// Update interval for facemesh
const interval = null;

// Load facemesh
const runFacemesh = async () => {
    const model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);

    interval = setInterval(() => {
        predictions(model);
    }, 100);
};

const predictions = async (model) => {

    if (
        webcamElement !== 'undefined' &&
        webcamElement !== null &&
        webcamElement.readyState === 4
    ) {
        // requestAnimationFrame(() => predictions(model));
        // Get video properties
        const video = webcamElement;
        const videoWidth = webcamElement.width;
        const videoHeight = webcamElement.height;

        // Set video properties
        webcamElement.width = videoWidth;
        webcamElement.height = videoHeight;
        
        // Set canvas properties
        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;

        const predictions = await model.estimateFaces({
            input: webcamElement
        });

        console.log(predictions);

        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].scaledMesh;
                // Log facial keypoints.
                for (let i = 0; i < keypoints.length; i++) {
                    const [x, y, z] = keypoints[i];
                    console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
                }
            }
        }
    }
};

// get permision from user, get all video inputs, start stream
btnStart.addEventListener('click', () => {
    webcam.start()
    .then(() => console.log("webcam started"))
    .catch(err => console.log(err));
});

// start stream to video element
btnStream.addEventListener('click', () => {
    webcam.stream()
    .then(() => console.log('stream started'))
    .catch(err => console.log(err));
});

// Stop streaming
btnStop.addEventListener('click', () => {
    webcam.stop();
    if (interval) clearInterval(interval);
});

// start facemesh detection
btnFacemesh.addEventListener('click', () => {
    runFacemesh()
});

