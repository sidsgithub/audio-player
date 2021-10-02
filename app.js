import {
  pauseButton,
  playButton,
  drawLineSegment,
  drawTagsHandler,
} from "./canvas.js";
import { functionToCreateTimeHash } from "./common.js";

const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // create audio context
const audioElement = document.querySelector("audio");
const hashedTime = functionToCreateTimeHash(audioElement); // array of timestamps for the audio file

// setting up the canvas
const canvas = document.querySelector("canvas");
const padding = 5;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight + padding * 0.5;
const ctx = canvas.getContext("2d");
const filteredData = [];
let normalizedData = [];
let width;

// main function to draw the waveform of the audio file
const drawAudio = (url) => {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => draw(normalizeData(filterData(audioBuffer))));
};

// filtering data to create a desired sample size
const filterData = (audioBuffer) => {
  const rawData = audioBuffer.getChannelData(0); // We can work with one channel of data
  const samples = 150; // Number of samples for our final data set
  const blockSize = Math.floor(rawData.length / samples); // the number of samples each subdivision contains
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  }
  return filteredData;
};

// fucntion to normalize the audio data using multiplier
const normalizeData = (filteredData) => {
  const multiplier = Math.pow(Math.max(...filteredData), -1);
  normalizedData = filteredData.map((n) => n * multiplier);
  return normalizedData;
};

// function to draw the canvas and it's elements
const draw = () => {
  ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas
  // lay the waveform using line segments
  width = canvas.offsetWidth / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    let x = width * i;
    let height = (normalizedData[i] * canvas.offsetHeight) / 5 - padding;
    if (height < 0) {
      height = 0;
    } else if (height > canvas.offsetHeight / 2) {
      height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, (i + 1) % 2, "lightgrey");
  }
  // create the tags
  drawTagsHandler(ctx, width, normalizedData);
  // create the play button initially
  playButton(ctx, "lightgrey");
};

// event handlers
const addEvents = () => {
  let playX = 410;
  let playY = 314;
  let playW = 30;
  let playH = 30;
  let mouseX;
  let mouseY;

  // event listner fired when audio ends
  audioElement.addEventListener("ended", () => {
    pauseButton(ctx, "white");
    playButton(ctx, "lightgrey");
  });

  // tracks mouse movements
  function eventMouseMove(event) {
    if (event.layerX || event.layerX === 0) {
      // Firefox
      mouseX = event.layerX;
      mouseY = event.layerY;
    } else if (event.offsetX || event.offsetX === 0) {
      // Opera
      mouseX = event.offsetX;
      mouseY = event.offsetY;
    }
  }

  // tracks play / pause
  function eventMouseUp() {
    //Hit Play
    if (
      mouseY >= playY &&
      mouseY <= playY + playH &&
      mouseX >= playX &&
      mouseX <= playX + playW
    ) {
      if (audioElement.paused) {
        audioElement.play();
        playButton(ctx, "white");
        pauseButton(ctx, "red");
        repaintWaveForm();
      } else if (!audioElement.paused) {
        audioElement.pause();
        pauseButton(ctx, "white");
        playButton(ctx, "lightgrey");
        repaintWaveForm();
      }
    }
  }

  // track users pause action on the audio waveform
  function pauseOnClick() {
    if (mouseY > 120 && mouseY < 270) {
      if (!audioElement.paused) {
        audioElement.pause();
        pauseButton(ctx, "white");
        playButton(ctx, "lightgrey");
        repaintWaveForm();
      }
    }
  }

  // track users play action on the audio waveform
  function playOnClick() {
    if (mouseY > 120 && mouseY < 270) {
      const moveTo = Math.floor((mouseX - 2) / 6);
      if (audioElement.paused) {
        audioElement.currentTime = hashedTime[moveTo];
        audioElement.play();
        playButton(ctx, "white");
        pauseButton(ctx, "red");
        repaintWaveForm();
        drawTo(moveTo);
      }
    }
  }

  canvas.addEventListener("click", eventMouseUp, false);
  canvas.addEventListener("mousemove", eventMouseMove, false);
  canvas.addEventListener("mousedown", pauseOnClick, false);
  canvas.addEventListener("mouseup", playOnClick, false);
};

// create the waveform to a scecific time.
const drawTo = (index) => {
  // create a rectangle
  ctx.rect(0, -80, canvas.offsetWidth, 150);
  ctx.fillStyle = "white";
  ctx.fill();

  // painr the initial waveform
  for (let i = 0; i < normalizedData.length; i++) {
    let x = width * i;
    let height = (normalizedData[i] * canvas.offsetHeight) / 5 - padding;
    if (height < 0) {
      height = 0;
    } else if (height > canvas.offsetHeight / 2) {
      height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, (i + 1) % 2, "lightgrey");
  }

  // paint the tags
  drawTagsHandler(ctx, width, normalizedData);

  // create the waveform to the new current time
  for (let i = 0; i < index + 1; i++) {
    let x = width * i;
    let height = (normalizedData[i] * canvas.offsetHeight) / 5 - padding;
    if (height < 0) {
      height = 0;
    } else if (height > canvas.offsetHeight / 2) {
      height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, (i + 1) % 2, "pink");
  }
};

// paint the waveform with audio playing
const repaintWaveForm = () => {
  const currentTime = Math.round(audioElement.currentTime * 10000) / 10000;
  let x, height;
  let i = hashedTime.findIndex((val) => val > currentTime);

  setTimeout(() => {
    x = width * i;
    height = (normalizedData[i] * canvas.offsetHeight) / 5 - padding;
    if (height < 0) {
      height = 0;
    } else if (height > canvas.offsetHeight / 2) {
      height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, (i + 1) % 2, "pink");
    i += 1;
    if (i < normalizedData.length && !audioElement.paused) {
      repaintWaveForm(i);
    }
  }, (audioElement.duration / 150) * 1000);
};
if(audioElement.buffered){
    drawAudio("audio_sample.mp3");
}
addEvents();
