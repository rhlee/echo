"use strict";

const duration = 0.5;

class Application {
  constructor(context, stream) {
    this.context = context;
    this.source = this.context.createMediaStreamSource(stream);
  }

  async start() {
    await this.context.audioWorklet.addModule("processor.mjs");
    const processor = new AudioWorkletNode(
      this.context,
      "processor",
      {processorOptions: {sampleSize: duration * this.context.sampleRate}}
    );
    this.port = processor.port;
    this.port.postMessage(null);
    this.port.onmessage = this.play.bind(this);
    this.source.connect(processor);
  }

  play(message) {
    console.log(message);
  }
}

document.addEventListener("DOMContentLoaded", async event => {
  (new Application(
    new (window.AudioContext || window.webkitAudioContext)(),
    await navigator.mediaDevices.getUserMedia({audio: {channelCount: 1}})
  )).start();
});
