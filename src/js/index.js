import "../style/style.css";
import WebcamEasy from 'webcam-easy';

// tensorflow imports
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";

// utils import
import { btnDisabledHandler, makeClearCanvas } from './utils.js';

// Functional elements
const webcamElement = document.querySelector('#webcam');
const canvasElement = document.querySelector('#canvas');
const clear = makeClearCanvas(canvasElement);

// User interaction elements
const btnStart = document.querySelector('.button.start');
const btnStream = document.querySelector('.button.stream');
const btnSnap = document.querySelector('.button.snap');
const btnFacemesh = document.querySelector('.button.facemesh');
const btnStop = document.querySelector('.button.stop');

// WebcamEasy instance
const webcam = new WebcamEasy(webcamElement, 'user', canvasElement);

// Update interval for facemesh
let interval = null;

// Webcam states
const webcamStates = {
    ON: true,
    PAUSED: 'paused',
    OFF: false
};

// Webcam state
let webcamState = false;

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
                    // console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
                }
            }
        }
    }
};

// get permision from user, get all video inputs, start stream
btnStart.addEventListener('click', () => {
    webcam.start()
    .then(() => {
        webcamState = webcamStates.ON;
        btnDisabledHandler(webcamState, [btnSnap, btnStop, btnFacemesh], [btnStream]);
        clear();
    })
    .catch(err => console.log(err));
});

// continue stream, clear canvas from image
btnStream.addEventListener('click', () => {
    webcam.stream();
    btnDisabledHandler(false, [btnStream], [btnSnap]);
    clear();
});

// take snap from video, render image on canvas
btnSnap.addEventListener('click', () => {
    const picture = webcam.snap();
    webcamState = webcamStates.PAUSED;
    btnDisabledHandler(false, [btnSnap], [btnStream]);
});

// Stop streaming
btnStop.addEventListener('click', () => {
    if (interval) clearInterval(interval);
    webcam.stop();
    webcamState = webcamStates.OFF;
    btnDisabledHandler(webcamState, [btnSnap, btnStop, btnFacemesh, btnStream]);
});

// start facemesh detection
btnFacemesh.addEventListener('click', () => {
    clear();
    if (webcamState) runFacemesh();
});

