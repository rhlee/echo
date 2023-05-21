"use strict";

document.addEventListener("DOMContentLoaded", async event => {
  (new Application(
    new (window.AudioContext || window.webkitAudioContext)(),
    await navigator.mediaDevices.getUserMedia({audio: true})
  )).start();
});

class Application {
  constructor(context, stream) {
    this.context = context;
    this.source = this.context.createMediaStreamSource(stream);
  }

  async start() {
    this.source.connect(this.context.destination);
  }
}
