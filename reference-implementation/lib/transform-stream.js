import ReadableStream from './readable-stream';
import WritableStream from './writable-stream';

export default class TransformStream {
  constructor({ transform, flush = (enqueue, close) => close() }) {
    if (typeof transform !== 'function') {
      throw new TypeError('transform must be a function');
    }

    var enqueueInOutput;
    this.output = new ReadableStream({
      start(enqueue, close, error) {
        enqueueInOutput = enqueue;
      }
    });

    this.input = new WritableStream({
      write(chunk, done, error) {
        transform(chunk, enqueueInOutput, done);
      }
    });
  }
}
