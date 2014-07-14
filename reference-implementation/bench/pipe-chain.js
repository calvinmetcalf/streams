import ReadableStream from '../lib/readable-stream';
import WritableStream from '../lib/writable-stream';
import TransformStream from '../lib/transform-stream';
import ByteLengthQueuingStrategy from '../lib/byte-length-queuing-strategy';

import params from './params';

var dataSoFar = 0;
var rs = new ReadableStream({
    start(enqueue, close, error) {
        var interval = setInterval(() => {
            if (dataSoFar >= params.totalSize) {
                clearInterval(interval);
                close();
                return;
            }

            var chunk = new ArrayBuffer(params.underlyingSourceChunkSize);
            enqueue(chunk);
            dataSoFar += chunk.byteLength;
        }, params.underlyingSourceRate);
    },

    strategy: new ByteLengthQueuingStrategy({ highWaterMark: params.readableStreamHWM })
});

var ts = new TransformStream({
    transform(chunk, enqueue, done) {
        var newChunk = new ArrayBuffer(params.underlyingSourceChunkSize * params.transformSizeMultiplier);
        setTimeout(() => enqueue(newChunk), params.transformSpeed / 2);
        setTimeout(done, params.transformSpeed);
    },
    inputStrategy: new ByteLengthQueuingStrategy({ highWaterMark: params.transformInputHWM }),
    outputStrategy: new ByteLengthQueuingStrategy({ highWaterMark: params.transformOutputHWM })
});

var ws = new WritableStream({
    write(chunk, done) {
        console.log('chunk', chunk.byteLength);
        setTimeout(done, params.underlyingSinkConsumptionSpeed);
    },

    strategy: new ByteLengthQueuingStrategy({ highWaterMark: params.writableStreamHWM })
});

// FIXME: use real benchmarking techniques
var start = Date.now();
rs.pipeThrough(ts).pipeTo(ws).closed.then(() => {
    console.log('all data piped', Date.now() - start);
});
