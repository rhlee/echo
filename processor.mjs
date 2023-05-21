"use strict";

const blockSize = 128;

class Processor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this.sampleSize = options.processorOptions.sampleSize;
    this.buffer = null;
    this.port.onmessage = this.start.bind(this);
  }

  start(message) {
    this.buffer = new Float32Array(new ArrayBuffer(
      this.sampleSize * Float32Array.BYTES_PER_ELEMENT
    ));
    this.position = 0;
  }

  process(inputs, outputs, parameters) {
    if (this.buffer !== null) {
      if ((this.sampleSize - this.position) >= blockSize) {
        this.buffer.set(inputs[0][0], this.position);
        this.position += blockSize;
      } else {
        const buffer = this.buffer.buffer;
        this.port.postMessage(buffer, [buffer]);
        this.buffer = null;
      }
    }
  }
}

registerProcessor("processor", Processor);
