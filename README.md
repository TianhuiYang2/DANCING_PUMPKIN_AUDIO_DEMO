# Audio Hallucination Experiment

## Project Overview

This p5.js experiment explores how music can transform an ordered field of dots into an unstable hallucination space.

The work was developed as an audio mechanic for the group project inspired by Yayoi Kusama’s repeated dots, immersive installations and Infinity Mirror Rooms.

Instead of treating the pumpkin as the entire project, this experiment develops the broader idea of hallucination through sound, movement, repetition and spatial distortion.

## Interaction

Click the canvas to play or pause the music.

When the music plays, the dot tunnel responds to different audio features:

- Overall loudness controls the breathing and scale of the dot field.
- Bass frequencies bend the rings and enlarge the central void.
- Mid frequencies control rotation and spatial twisting.
- Treble frequencies control brightness and opacity.
- Detected beats create brief vibration and fracture effects.

When the music becomes stronger, the ordered tunnel becomes increasingly unstable. When the music stops, the visual returns to a calmer and more structured state.

## File Structure

### `index.html`

Loads the p5.js and p5.sound libraries, followed by the audio mechanic and the main sketch.

### `audio-mechanic.js`

Loads and analyses the music.

Main functions:

- `preloadAudio()` loads the audio file.
- `setupAudio()` creates the amplitude and FFT analysers.
- `getAudioFeatures()` returns loudness, bass, mid, treble, beat and playback state.
- `toggleAudio()` plays or pauses the music.

### `sketch.js`

Creates the audio-responsive hallucination visual.

Main functions:

- `drawBackgroundGlow()` draws the coloured glow behind the tunnel.
- `drawHallucinationField()` draws and distorts the repeated dot rings.
- `drawCentreVoid()` creates the dark centre of the tunnel.
- `drawInstruction()` displays the play and pause instruction.

### `assets/music.mp3`

The audio file used by the experiment.

## How to Run

1. Open the project folder in Visual Studio Code.
2. Open `index.html` using Live Server.
3. Click the canvas to start or pause the music.
4. Observe how the dot field responds to the audio.

An internet connection is required because the p5.js and p5.sound libraries are loaded through CDN links.

## Development Process

The experiment began with a literal dotted pumpkin controlled by audio.

Following tutor feedback, the design moved away from treating the pumpkin as the whole concept. The audio mechanic was developed into a more abstract hallucination space.

Several versions were tested:

1. A strongly distorted version with large overlapping dots.
2. A clearer version with reduced overlap and a more visible tunnel.
3. A balanced version that preserves both audio response and spatial clarity.

The Git commit history records these stages of development.

## Technical References

- p5.js Sound Library
- `p5.Amplitude`
- `p5.FFT`
- `loadSound()`

## AI Acknowledgement

ChatGPT by OpenAI was used to assist with code debugging, code restructuring and visual iteration.

AI-generated suggestions were reviewed, tested and adapted by the student. The final implementation was modified through repeated browser testing and comparison between different audio-responsive versions.

AI acknowledgement comments are also included in the relevant JavaScript files.