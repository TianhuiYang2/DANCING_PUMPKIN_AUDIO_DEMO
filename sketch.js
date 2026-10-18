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

  translate(width / 2, height / 2);
  noStroke();

  /*
    Loudness controls the size and transparency
    of the glow behind the tunnel.
  */
  let glowSize =
    320 +
    audio.loudness * 180;

  fill(
    120 + audio.mid * 80,
    20,
    100 + audio.treble * 100,
    25 + audio.loudness * 30
  );

  circle(0, 0, glowSize);

  fill(
    255,
    90,
    15,
    15 + audio.bass * 24
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

  translate(width / 2, height / 2);

  let time =
    millis() * 0.001;

  /*
    Mid frequencies rotate the visual space.
  */
  let sceneRotation =
    sin(time * 0.35) * 0.035 +
    audio.mid * 0.1;

  rotate(sceneRotation);

  /*
    A detected beat briefly shakes the field.
    The reduced amount prevents excessive jumping.
  */
  let beatShake =
    audio.beat * 7;

  translate(
    sin(time * 37) * beatShake,
    cos(time * 31) * beatShake
  );

  /*
    Slightly fewer rings and dots give each
    point more space and preserve the tunnel.
  */
  let numberOfRings = 16;
  let dotsPerRing = 36;

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
        34,
        470,
        ringAmount
      );

    /*
      Loudness makes the whole tunnel breathe.
      The limited scale prevents the rings
      from collapsing into one dense shape.
    */
    let breathingScale =
      0.97 +
      audio.loudness * 0.12;

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
        dotAmount * TWO_PI;

      /*
        Bass bends the rings into waves.
      */
      let bassWave =
        sin(
          baseAngle * 4 +
          time * 1.4 -
          ringIndex * 0.7
        ) *
        (
          3 +
          audio.bass * 20
        );

      /*
        Mid frequencies twist the rings.
      */
      let twist =
        sin(
          ringIndex * 0.65 -
          time * 0.8
        ) *
        (
          0.025 +
          audio.mid * 0.14
        );

      /*
        Beat energy briefly fractures the rings.
        This remains visible without scattering
        the dots too far.
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
        28;

      let angle =
        baseAngle + twist;

      let distortedRadius =
        ringRadius + bassWave;

      let x =
        cos(angle) *
        distortedRadius +
        cos(angle * 5) *
        fracture;

      /*
        Vertical compression creates depth
        and makes the rings resemble a tunnel.
      */
      let y =
        sin(angle) *
        distortedRadius *
        0.76 +
        sin(angle * 4) *
        fracture;

      /*
        Dots near the centre appear larger.
        Outer dots remain smaller.
      */
      let perspective =
        map(
          ringAmount,
          0,
          1,
          1.2,
          0.58
        );

      /*
        A slow internal pulse continues even
        between louder moments of the music.
      */
      let pulse =
        (
          sin(
            time * 2.2 -
            ringIndex * 0.55
          ) +
          1
        ) /
        2;

      /*
        Music still changes dot size, but the
        maximum growth is reduced to avoid overlap.
      */
      let dotSize =
        (
          4 +
          pulse * 4 +
          audio.loudness * 6 +
          audio.bass * 4
        ) *
        perspective;

      dotSize = constrain(
        dotSize,
        2.5,
        16
      );

      /*
        Treble controls brightness and opacity.
      */
      let alpha =
        105 +
        audio.treble * 130;

      if (
        (ringIndex + dotIndex) % 3 === 0
      ) {
        fill(
          255,
          197,
          38,
          alpha
        );
      } else if (
        (ringIndex + dotIndex) % 3 === 1
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

  translate(width / 2, height / 2);
  noStroke();

  /*
    Bass expands the centre of the tunnel.
  */
  let voidSize =
    78 +
    audio.bass * 30;

  fill(
    4,
    1,
    12,
    238
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
    audio.loudness * 2
  );

  circle(
    0,
    0,
    voidSize +
    15 +
    audio.beat * 16
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