let fibonacci = [1, 1];
let scale = 1;
let shrinkRate = 0.99;

let sqCheckbox;
let numCheckbox;
let colCheckbox;
let frameRateSlider;
let frameRateSliderLabel;
let fullScreenBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  angleMode(DEGREES);
  initFibonacci();
  
  sqCheckbox = createCheckbox('squares');
  numCheckbox = createCheckbox('numbers');
  colCheckbox = createCheckbox('colors');
  frameRateSliderLabel = createSpan('frameRate');
  fullScreenBtn = createButton('fullScreen');
  frameRateSlider = createSlider(1, 60, 30, 1);
  sqCheckbox.style('color', '#FFFFFF');
  numCheckbox.style('color', '#FFFFFF');
  colCheckbox.style('color', '#FFFFFF');
  frameRateSliderLabel.style('color', '#FFFFFF');
  
  setDOMPositions();
  fullScreenBtn.mousePressed(fullScreen);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  
  for (let j = 0; j < fibonacci.length; j++) {
    let current = fibonacci[j];
    let len = current * scale;
    
    if (sqCheckbox.checked()) {
      push();
      fill(0);
      stroke(255);
      rect(0, 0, len, len);
      pop();
    }
    
    if (numCheckbox.checked()) {
      push();
      fill(255);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(current, len / 2, len / 2);
      pop();
    }
    
    push();
    if (colCheckbox.checked()) {
      colorMode(HSB, 360, 100, 100);
      let hue = map(noise(0.005 * frameCount), 0, 1, 0, 360);
      stroke(hue, 80, 100);
    } else {
      stroke(255, 215, 0);
    }
    noFill();
    strokeWeight(2);
    arc(len, 0, len * 2, len * 2, 90, 180);
    pop();
    
    translate(len, len);
    rotate(-90);
  }
  
  let minScale = fibonacci[fibonacci.length - 5] / fibonacci[fibonacci.length - 1];  
  if (scale <= minScale) {
    scale = 1;
  } else {
    scale *= shrinkRate;
  }
  frameRate(frameRateSlider.value());
}

function initFibonacci() {
  const MAX_LENGTH = 25;
  for (let i = 2; i < MAX_LENGTH; i++) {
    let next = fibonacci[i - 1] + fibonacci[i - 2];
    fibonacci.push(next);
  }
}

function fullScreen() {
  let fs = fullscreen();
  fullscreen(!fs);
}

function setDOMPositions() {
  const offsetWidth = 20;
  sqCheckbox.position(0, windowHeight - sqCheckbox.elt.offsetHeight);
  numCheckbox.position(sqCheckbox.elt.offsetWidth + offsetWidth, windowHeight - numCheckbox.elt.offsetHeight);
  colCheckbox.position(sqCheckbox.elt.offsetWidth + numCheckbox.elt.offsetWidth + offsetWidth * 2, windowHeight - colCheckbox.elt.offsetHeight);
  frameRateSlider.position(sqCheckbox.elt.offsetWidth + numCheckbox.elt.offsetWidth + colCheckbox.elt.offsetWidth + offsetWidth * 3, windowHeight - frameRateSlider.elt.offsetHeight - 2);
  frameRateSliderLabel.position(sqCheckbox.elt.offsetWidth + numCheckbox.elt.offsetWidth + colCheckbox.elt.offsetWidth + frameRateSlider.elt.offsetWidth + offsetWidth * 3 + 4, windowHeight - frameRateSliderLabel.elt.offsetHeight - 1);
  fullScreenBtn.position(windowWidth - fullScreenBtn.elt.offsetWidth - 1, windowHeight - fullScreenBtn.elt.offsetHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  setDOMPositions();
}