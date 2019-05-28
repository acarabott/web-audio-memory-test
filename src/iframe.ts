import { getElementById } from "./getElementById.js";
import { onReady } from "./onReady.js";

const FILE_PATH = "../sine.mp3";

(window as any).AudioContext = window.hasOwnProperty("AudioContext")
  ? (window as any).AudioContext
  : window.hasOwnProperty("webkitAudioContext")
  ? (window as any).webkitAudioContext
  : undefined;

const loadBuffer = (audioContext: BaseAudioContext, count: number) => {
  const promises: Array<Promise<AudioBuffer>> = [];

  for (let i = 0; i < count; i++) {
    const promise = new Promise<AudioBuffer>(async (resolve, reject) => {
      const response = await fetch(FILE_PATH, { mode: "no-cors" });
      const arrayBuffer = await response.arrayBuffer();
      return new Promise<AudioBuffer>(() => {
        if (audioContext !== null) {
          try {
            audioContext.decodeAudioData(arrayBuffer, buff => resolve(buff));
          } catch (error) {
            reject(error);
          }
        }
      });
    });
    promises.push(promise);
  }

  return promises;
};

onReady(async () => {
  let allBuffers: AudioBuffer[] = [];

  let audioContext: AudioContext | null = new AudioContext();

  const update = () => {
    const statsEl = getElementById("stats");

    statsEl.textContent = `Buffer Count: ${allBuffers.length}`;
  };

  update();

  const loadEl = getElementById<HTMLButtonElement>("load");
  loadEl.onclick = async () => {
    if (audioContext !== null) {
      const count = getElementById<HTMLInputElement>("buffer-count").valueAsNumber;
      const promises = loadBuffer(audioContext, count);
      for (const promise of promises) {
        allBuffers.push(await promise);
        update();
      }
    }
    update();
  };

  const zeroEl = getElementById<HTMLButtonElement>("zero");
  zeroEl.onclick = async () => {
    for (const buffer of allBuffers) {
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        buffer.getChannelData(c).set([]);
      }
    }
    update();
  };

  const deleteBuffersEl = getElementById<HTMLButtonElement>("delete-buffers");
  deleteBuffersEl.onclick = async () => {
    allBuffers = [];
    update();
  };

  const closeEl = getElementById<HTMLButtonElement>("close");
  closeEl.onclick = () => {
    if (audioContext !== null) {
      audioContext.close();
    }
    update();
  };

  const deleteEl = getElementById<HTMLButtonElement>("delete");
  deleteEl.onclick = () => {
    audioContext = null;
    update();
  };
});
