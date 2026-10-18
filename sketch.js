/*
AI ACKNOWLEDGEMENT:
ChatGPT (OpenAI, 2026) assisted with generating and
restructuring parts of this audio-responsive visual.
The student tested, reviewed and adapted the code.

The music controls the scale, distortion, rotation,
opacity and vibration of the dot field.
*/

function preload() {
  preloadAudio();
}

function setup() {
  createCanvas(700, 700);

  setupAudio();

  colorMode(RGB, 255, 255, 255, 255);
  noStroke();
}

function draw() {
  background(8, 4, 18);

  let audio = getAudioFeatures();

  drawBackgroundGlow(audio);
  drawHallucinationField(audio);
  drawCentreVoid(audio);
  drawInstruction(audio);
}

function drawBackgroundGlow(audio) {
  push();

  translate(
    width / 2,
    height / 2
  );

  noStroke();

  /*
    Loudness controls the size and transparency
    of the glow behind the dot field.
  */
  let glowSize =
    330 +
    audio.loudness * 230;

  fill(
    120 + audio.mid * 80,
    20,
    100 + audio.treble * 100,
    28 + audio.loudness * 35
  );

  circle(
    0,
    0,
    glowSize
  );

  fill(
    255,
    90,
    15,
    18 + audio.bass * 28
  );

  circle(
    0,
    0,
    glowSize * 0.68
  );

  pop();
}

function drawHallucinationField(audio) {
  push();

  translate(
    width / 2,
    height / 2
  );

  let time =
    millis() * 0.001;

  /*
    The middle frequencies slowly rotate
    the whole visual space.
  */
  let sceneRotation =
    sin(time * 0.35) * 0.04 +
    audio.mid * 0.12;

  rotate(sceneRotation);

  /*
    A detected beat briefly moves the whole field.
  */
  let beatShake =
    audio.beat * 13;

  translate(
    sin(time * 37) * beatShake,
    cos(time * 31) * beatShake
  );

  let numberOfRings = 17;
  let dotsPerRing = 38;

  for (
    let ringIndex = 0;
    ringIndex < numberOfRings;
    ringIndex++
  ) {
    let ringAmount =
      ringIndex /
      (numberOfRings - 1);

    let baseRadius =
      lerp(
        30,
        470,
        ringAmount
      );

    /*
      Loudness makes the dot field breathe.
    */
    let breathingScale =
      0.96 +
      audio.loudness * 0.16;

    let ringRadius =
      baseRadius *
      breathingScale;

    for (
      let dotIndex = 0;
      dotIndex < dotsPerRing;
      dotIndex++
    ) {
      let dotAmount =
        dotIndex /
        dotsPerRing;

      let baseAngle =
        dotAmount *
        TWO_PI;

      /*
        Bass bends every ring into a wave.
      */
      let bassWave =
        sin(
          baseAngle * 4 +
          time * 1.4 -
          ringIndex * 0.7
        ) *
        (
          3 +
          audio.bass * 26
        );

      /*
        Mid frequencies twist the rings,
        creating spatial distortion.
      */
      let twist =
        sin(
          ringIndex * 0.65 -
          time * 0.8
        ) *
        (
          0.025 +
          audio.mid * 0.18
        );

      /*
        Beat energy creates a short fracture,
        but noise keeps the movement organic.
      */
      let fracture =
        (
          noise(
            ringIndex * 0.24,
            dotIndex * 0.18,
            time * 0.35
          ) -
          0.5
        ) *
        audio.beat *
        48;

      let angle =
        baseAngle +
        twist;

      let distortedRadius =
        ringRadius +
        bassWave;

      let x =
        cos(angle) *
        distortedRadius +
        cos(angle * 5) *
        fracture;

      /*
        The vertical compression makes the rings
        feel like a tunnel rather than flat circles.
      */
      let y =
        sin(angle) *
        distortedRadius *
        0.76 +
        sin(angle * 4) *
        fracture;

      /*
        Loudness enlarges the dots.
        Outer dots remain slightly smaller.
      */
      let perspective =
        map(
          ringAmount,
          0,
          1,
          1.25,
          0.58
        );

      let pulse =
        (
          sin(
            time * 2.2 -
            ringIndex * 0.55
          ) +
          1
        ) /
        2;

      let dotSize =
        (
          4 +
          pulse * 5 +
          audio.loudness * 11 +
          audio.bass * 7
        ) *
        perspective;

      /*
        Treble changes brightness and opacity.
      */
      let alpha =
        105 +
        audio.treble * 130;

      if (
        (ringIndex + dotIndex) %
        3 ===
        0
      ) {
        fill(
          255,
          197,
          38,
          alpha
        );
      } else if (
        (ringIndex + dotIndex) %
        3 ===
        1
      ) {
        fill(
          247,
          78,
          121,
          alpha
        );
      } else {
        fill(
          118,
          92,
          255,
          alpha
        );
      }

      circle(
        x,
        y,
        dotSize
      );
    }
  }

  pop();
}

function drawCentreVoid(audio) {
  push();

  translate(
    width / 2,
    height / 2
  );

  noStroke();

  /*
    The dark centre expands slightly with bass,
    making the dot field resemble an unstable space.
  */
  let voidSize =
    72 +
    audio.bass * 42;

  fill(
    4,
    1,
    12,
    235
  );

  circle(
    0,
    0,
    voidSize
  );

  noFill();

  stroke(
    255,
    186,
    35,
    90 + audio.treble * 140
  );

  strokeWeight(
    1.5 +
    audio.loudness * 3
  );

  circle(
    0,
    0,
    voidSize +
    15 +
    audio.beat * 25
  );

  pop();
}

function drawInstruction(audio) {
  noStroke();
  textAlign(CENTER);
  textSize(15);

  fill(
    255,
    225
  );

  let message;

  if (audio.playing) {
    message =
      "Music playing — click to pause";
  } else {
    message =
      "Click the canvas to play the music";
  }

  text(
    message,
    width / 2,
    height - 22
  );
}

function mousePressed() {
  toggleAudio();
}