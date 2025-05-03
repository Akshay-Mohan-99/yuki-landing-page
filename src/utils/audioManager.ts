// audioManager.ts

let audioCtx: AudioContext | null = null;
const audioBuffers: Record<string, AudioBuffer> = {};

const soundFiles: Record<string, string> = {
  catPop: "/sounds/cat_pop.mp3",
  catClick: "/sounds/cat_click.mp3",
};

export const initAudio = async () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  for (const [key, url] of Object.entries(soundFiles)) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioBuffers[key] = buffer;
  }
};

export const playSound = (soundKey: keyof typeof soundFiles) => {
  if (!audioCtx || !audioBuffers[soundKey]) return;

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffers[soundKey];
  source.connect(audioCtx.destination);
  source.start(0);
};
