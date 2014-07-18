import ReadableStream from '../lib/readable-stream';
import WritableStream from '../lib/writable-stream';
import TransformStream from '../lib/transform-stream';
import ByteLengthQueuingStrategy from '../lib/byte-length-queuing-strategy';

export default params => {
  var chunksSoFar = 0;
  var paused = false;
  var pauses = 0;

  var rs = new ReadableStream({
    start(enqueue, close) {
      var interval = setInterval(() => {
        if (paused) {
          return;
        }

        if (chunksSoFar++ >= params.underlyingSourceChunks) {
          clearInterval(interval);
          close();
          return;
        }

        var chunk = new ArrayBuffer(params.underlyingSourceChunkSize);
        if (!enqueue(chunk)) {
          paused = true;
          ++pauses;
        }
      }, params.underlyingSourceRate);
    },

    pull(enqueue, close) {
      paused = false;
    },

    strategy: new ByteLengthQueuingStrategy({ highWaterMark: params.readableStreamHWM })
  });

  var ts = new TransformStream({
    transform(chunk, enqueue, done) {
      var newChunk = new ArrayBuffer(params.underlyingSourceChunkSize * params.transformSizeMultiplier);
      setTimeout(() => enqueue(newChunk), params.transformRate / 2);
      setTimeout(done, params.transformRate);
    },
    inputStrategy: new ByteLengthQueuingStrategy({ highWaterMark: params.transformInputHWM }),
    outputStrategy: new ByteLengthQueuingStrategy({ highWaterMark: params.transformOutputHWM })
  });

  var ws = new WritableStream({
    write(chunk, done) {
      setTimeout(done, params.underlyingSinkRate);
    },

    strategy: new ByteLengthQueuingStrategy({ highWaterMark: params.writableStreamHWM })
  });

  return rs.pipeThrough(ts).pipeTo(ws).closed.then(() => ({ pauses }));
};
