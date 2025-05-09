let fibonacci = [1, 1];
let scale = 1;
let shrinkRate = 0.99;
let bgOn = true;

// Panel
let uiPanel;
let sliderRow;
let hideControlsBtn;
let showControlsBtn;

// Controls
let sqCheckbox;
let numCheckbox;
let colCheckbox;
let bgCheckbox;
let frameRateSlider;
let frameRateSliderLabel;
let frameRateSliderValue;
let fullScreenBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  angleMode(DEGREES);
  initFibonacci();
  initControls();
  setDOMPositions();
}

function draw() {
  if (bgCheckbox.checked())
    background(0);
  translate(width / 2, height / 2);

  for (let j = 0; j < fibonacci.length; j++) {
    let current = fibonacci[j];
    let len = current * scale;

    if (sqCheckbox.checked()) {
      // Draw squares
      push();
      fill(0);
      stroke(255);
      rect(0, 0, len, len);
      pop();
    }

    if (numCheckbox.checked()) {
      // Draw numbers
      push();
      fill(255);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(current, len / 2, len / 2);
      pop();
    }

    // Draw arcs
    push();
    if (colCheckbox.checked()) {
      // Draw colors
      colorMode(HSB, 360, 100, 100);
      let hue = map(noise(0.005 * frameCount), 0, 1, 0, 360);
      stroke(hue, 80, 100);
    } else {
      // Draw gold
      stroke(255, 215, 0);
    }
    noFill();
    strokeWeight(bgCheckbox.checked() ? 2 : 10);
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
  console.log(fs);
  fullscreen(!fs);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  setDOMPositions();
}

function keyPressed() {
  if (key === 'h' || key === 'H') {
    toggleControls();
  }
}

// Controls

function initControls() {
  uiPanel = createDiv();
  stylePanel(uiPanel);

  let sliderRow = createDiv();
  styleSliderRow(sliderRow);

  hideControlsBtn = createButton('❌');
  hideControlsBtn.parent(uiPanel);
  hideControlsBtn.mousePressed(toggleControls);
  styleIconButton(hideControlsBtn);
  styleHideControlsButton();
  hideControlsBtn.mouseOver(() => {
    hideControlsBtn.style('background', '#f0f0f0');
  });
  hideControlsBtn.mouseOut(() => {
    hideControlsBtn.style('background', '#ffffff');
  });

  showControlsBtn = createButton('⚙️');
  showControlsBtn.position(10, 10);
  showControlsBtn.mousePressed(toggleControls);
  showControlsBtn.hide();
  styleIconButton(showControlsBtn);

  sqCheckbox = createCheckbox('squares');
  sqCheckbox.parent(uiPanel);
  sqCheckbox.changed(function () {
    if (!bgOn) {
      sqCheckbox.checked(false);
    }
  })

  numCheckbox = createCheckbox('numbers');
  numCheckbox.parent(uiPanel);
  numCheckbox.changed(function () {
    if (!bgOn) {
      numCheckbox.checked(false);
    }
  });

  colCheckbox = createCheckbox('colors');
  colCheckbox.parent(uiPanel);

  bgCheckbox = createCheckbox('background', true);
  bgCheckbox.parent(uiPanel);
  bgCheckbox.changed(function () {
    bgOn = bgCheckbox.checked();

    sqCheckbox.elt.disabled = !bgOn;
    sqCheckbox.style('opacity', sqCheckbox.elt.disabled ? '0.5' : '1');
    numCheckbox.elt.disabled = !bgOn;
    numCheckbox.style('opacity', numCheckbox.elt.disabled ? '0.5' : '1');
    if (!bgOn) {
      background(0);
      sqCheckbox.checked(bgOn);
      numCheckbox.checked(bgOn);
    }
  });

  frameRateSliderLabel = createSpan('frameRate');
  frameRateSliderLabel.parent(sliderRow);

  frameRateSlider = createSlider(1, 60, 30, 1);
  frameRateSlider.parent(sliderRow);

  frameRateSliderValue = createSpan('30 FPS');
  frameRateSliderValue.parent(sliderRow);

  frameRateSlider.input(function () {
    frameRateSliderValue.html(frameRateSlider.value() + ' FPS');
  });

  if (isMobileDevice()) {
    fullScreenBtn = createButton('🔲');
    fullScreenBtn.mousePressed(fullScreen);
    styleIconButton(fullScreenBtn);
  }
  sliderRow.parent(uiPanel);
}

function toggleControls() {
  if (uiPanel.elt.style.display === 'none') {
    uiPanel.elt.style.display = 'flex';
    showControlsBtn.hide();
  } else {
    uiPanel.elt.style.display = 'none';
    showControlsBtn.show();
  }
}

function setDOMPositions() {
  if (isMobileDevice())
    fullScreenBtn.position(windowWidth - fullScreenBtn.elt.offsetWidth - 10, 10);
}

function stylePanel(panel) {
  panel.style('position', 'fixed');
  panel.style('top', '10px');
  panel.style('left', '10px');
  panel.style('background', 'rgba(255,255,255,0.7)');
  panel.style('padding', '10px');
  panel.style('border-radius', '8px');
  panel.style('display', 'flex');
  panel.style('flex-direction', 'column');
  panel.style('gap', '10px');
  panel.style('z-index', '10');
}

function styleSliderRow(sliderRow) {
  sliderRow.style('display', 'flex');
  sliderRow.style('align-items', 'center');
  sliderRow.style('gap', '10px');
}

function styleIconButton(btn) {
  btn.style('font-size', '20px');
  btn.style('padding', '4px 10px');
  btn.style('background', '#ffffff');
  btn.style('border', '1px solid #ccc');
  btn.style('border-radius', '6px');
  btn.style('cursor', 'pointer');
  btn.style('box-shadow', '1px 1px 3px rgba(0,0,0,0.1)');
}

function styleHideControlsButton() {
  hideControlsBtn.style('position', 'absolute');
  hideControlsBtn.style('top', '5px');
  hideControlsBtn.style('right', '5px');
}

// Helpers

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}