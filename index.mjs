"use strict";

const duration = 0.5;

class Application {
  constructor(context, stream) {
    this.context = context;
    this.source = this.context.createMediaStreamSource(stream);
    this.buffer = this.context.
      createBuffer(1, this.context.sampleRate, this.context.sampleRate);
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
    this.buffer.copyToChannel(new Float32Array(message.data), 0);
    const bufferSource = this.context.createBufferSource();
    bufferSource.connect(this.context.destination);
    bufferSource.buffer = this.buffer;
    bufferSource.start();
  }
}

document.addEventListener("DOMContentLoaded", async event => {
  (new Application(
    new (window.AudioContext || window.webkitAudioContext)(),
    await navigator.mediaDevices.getUserMedia({audio: {channelCount: 1}})
  )).start();
});
