/**
 * Web Audio API synthesizer that generates a melodic 60-second karaoke backing track
 * with rhythm beats and chords, rendered directly into a playable WAV Blob.
 */

export async function generateKaraokeBackingTrackWav(durationSeconds = 45): Promise<string> {
  const sampleRate = 44100;
  const numChannels = 2;
  const totalSamples = sampleRate * durationSeconds;

  // Use OfflineAudioContext for fast rendering
  const offlineCtx = new OfflineAudioContext(numChannels, totalSamples, sampleRate);

  const tempo = 96; // BPM
  const secondsPerBeat = 60 / tempo;

  // Chord progression: Am -> F -> C -> G (Classic emotional pop/ballad)
  // Frequencies for chords:
  // Am: A3 (220), C4 (261.63), E4 (329.63)
  // F:  F3 (174.61), A3 (220), C4 (261.63)
  // C:  C3 (130.81), E3 (164.81), G3 (196.00)
  // G:  G3 (196.00), B3 (246.94), D4 (293.66)
  const chords = [
    [220.0, 261.63, 329.63, 440.0], // Am
    [174.61, 220.0, 261.63, 349.23], // F
    [130.81, 164.81, 196.0, 261.63], // C
    [196.0, 246.94, 293.66, 392.0], // G
  ];

  const bassNotes = [110.0, 87.31, 65.41, 98.0]; // A1, F1, C1, G1

  const numMeasures = Math.ceil(durationSeconds / (secondsPerBeat * 4));

  for (let m = 0; m < numMeasures; m++) {
    const chordIdx = m % 4;
    const chordTime = m * 4 * secondsPerBeat;
    if (chordTime >= durationSeconds) break;

    const chord = chords[chordIdx];
    const bass = bassNotes[chordIdx];

    // Play bass note on beats 1 and 3
    [0, 2].forEach((beatOffset) => {
      const bTime = chordTime + beatOffset * secondsPerBeat;
      if (bTime < durationSeconds) {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bass, bTime);

        gain.gain.setValueAtTime(0.35, bTime);
        gain.gain.exponentialRampToValueAtTime(0.001, bTime + secondsPerBeat * 1.8);

        osc.connect(gain);
        gain.connect(offlineCtx.destination);

        osc.start(bTime);
        osc.stop(bTime + secondsPerBeat * 1.8);
      }
    });

    // Play chord arpeggio across 4 beats
    for (let step = 0; step < 8; step++) {
      const stepTime = chordTime + step * (secondsPerBeat / 2);
      if (stepTime >= durationSeconds) break;

      const note = chord[step % chord.length];
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, stepTime);

      gain.gain.setValueAtTime(0.18, stepTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stepTime + secondsPerBeat * 0.9);

      // Stereo panning emulation
      const panner = offlineCtx.createStereoPanner ? offlineCtx.createStereoPanner() : null;
      if (panner) {
        panner.pan.value = (step % 2 === 0 ? -0.4 : 0.4);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(offlineCtx.destination);
      } else {
        osc.connect(gain);
        gain.connect(offlineCtx.destination);
      }

      osc.start(stepTime);
      osc.stop(stepTime + secondsPerBeat * 0.9);
    }

    // Drum beat: Kick on 1 and 3, Snare on 2 and 4, Hi-hat on eighth notes
    for (let beat = 0; beat < 4; beat++) {
      const beatTime = chordTime + beat * secondsPerBeat;
      if (beatTime >= durationSeconds) break;

      // Kick drum (beat 0 and 2)
      if (beat === 0 || beat === 2) {
        const kickOsc = offlineCtx.createOscillator();
        const kickGain = offlineCtx.createGain();
        kickOsc.frequency.setValueAtTime(120, beatTime);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, beatTime + 0.3);

        kickGain.gain.setValueAtTime(0.5, beatTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.3);

        kickOsc.connect(kickGain);
        kickGain.connect(offlineCtx.destination);

        kickOsc.start(beatTime);
        kickOsc.stop(beatTime + 0.3);
      }

      // Snare drum (beat 1 and 3)
      if (beat === 1 || beat === 3) {
        // Noise buffer for snare
        const bufferSize = sampleRate * 0.15;
        const noiseBuffer = offlineCtx.createBuffer(1, bufferSize, sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = offlineCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = offlineCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        const snareGain = offlineCtx.createGain();
        snareGain.gain.setValueAtTime(0.25, beatTime);
        snareGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.15);

        whiteNoise.connect(filter);
        filter.connect(snareGain);
        snareGain.connect(offlineCtx.destination);

        whiteNoise.start(beatTime);
        whiteNoise.stop(beatTime + 0.15);
      }

      // Hi-Hat on every eighth note
      for (let h = 0; h < 2; h++) {
        const hTime = beatTime + h * (secondsPerBeat / 2);
        if (hTime >= durationSeconds) break;

        const hBufSize = sampleRate * 0.04;
        const hBuf = offlineCtx.createBuffer(1, hBufSize, sampleRate);
        const hData = hBuf.getChannelData(0);
        for (let i = 0; i < hBufSize; i++) {
          hData[i] = (Math.random() * 2 - 1) * 0.5;
        }

        const hSource = offlineCtx.createBufferSource();
        hSource.buffer = hBuf;

        const hFilter = offlineCtx.createBiquadFilter();
        hFilter.type = 'highpass';
        hFilter.frequency.value = 6000;

        const hGain = offlineCtx.createGain();
        hGain.gain.setValueAtTime(0.12, hTime);
        hGain.gain.exponentialRampToValueAtTime(0.001, hTime + 0.04);

        hSource.connect(hFilter);
        hFilter.connect(hGain);
        hGain.connect(offlineCtx.destination);

        hSource.start(hTime);
        hSource.stop(hTime + 0.04);
      }
    }
  }

  // Render audio to AudioBuffer
  const renderedBuffer = await offlineCtx.startRendering();

  // Convert renderedBuffer to WAV Blob URL
  const wavBlob = audioBufferToWavBlob(renderedBuffer);
  return URL.createObjectURL(wavBlob);
}

/**
 * Encodes an AudioBuffer into standard 16-bit PCM WAV Blob
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const outBuffer = new ArrayBuffer(length);
  const view = new DataView(outBuffer);
  const channels: Float32Array[] = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(pos++, str.charCodeAt(i));
    }
  }

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  writeString('RIFF');
  setUint32(length - 8);
  writeString('WAVE');
  writeString('fmt ');
  setUint32(16); // subchunk1size
  setUint16(1); // PCM
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // bits per sample
  writeString('data');
  setUint32(length - pos - 4);

  for (let i = 0; i < numOfChan; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([outBuffer], { type: 'audio/wav' });
}
