/*
AI ACKNOWLEDGEMENT:
ChatGPT (OpenAI, 2026) assisted with generating, debugging
and restructuring parts of this code. The student tested
and modified the code for the final prototype.
*/

let song;
let amp;
let fft;

let smoothMusicPulse = 0;
let audioBaseline = 0;
let baselineReady = false;

function preloadAudio() {
  song = loadSound(
    "assets/music.mp3"
  );
}

function setupAudio() {
  amp = new p5.Amplitude();
  amp.setInput(song);

  fft = new p5.FFT(
    0.82,
    128
  );

  fft.setInput(song);
}

function toggleAudio() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    baselineReady = false;
    smoothMusicPulse = 0;

    song.loop();
  }
}

function getMusicPulse() {
  if (
    !song ||
    !song.isPlaying()
  ) {
    smoothMusicPulse = lerp(
      smoothMusicPulse,
      0,
      0.08
    );

    return smoothMusicPulse;
  }

  fft.analyze();

  let amplitude =
    amp.getLevel();

  let bass =
    fft.getEnergy(
      20,
      180
    ) / 255;

  let lowMid =
    fft.getEnergy(
      180,
      500
    ) / 255;

  let currentEnergy =
    amplitude * 3.5 +
    bass * 0.55 +
    lowMid * 0.3;

  if (!baselineReady) {
    audioBaseline =
      currentEnergy;

    baselineReady = true;
  }

  audioBaseline = lerp(
    audioBaseline,
    currentEnergy,
    0.025
  );

  let energyDifference =
    currentEnergy -
    audioBaseline;

  let energyPulse = map(
    energyDifference,
    -0.045,
    0.065,
    0,
    1,
    true
  );

  /*
    为动态较弱的音乐补充缓慢节奏。

    音乐暂停后，动画也会停止。
  */
  let rhythmPulse =
    (
      sin(
        song.currentTime() *
        TWO_PI *
        1.15
      ) +
      1
    ) / 2;

  let targetPulse =
    energyPulse * 0.65 +
    rhythmPulse * 0.35;

  smoothMusicPulse = lerp(
    smoothMusicPulse,
    targetPulse,
    0.1
  );

  return constrain(
    smoothMusicPulse,
    0,
    1
  );
}