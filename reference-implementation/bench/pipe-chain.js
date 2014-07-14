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

var ws = new WritableStream({
    write(chunk, done) {
        console.log('chunk', chunk.byteLength);
        setTimeout(done, params.underlyingSinkConsumptionSpeed);
    },

    strategy: new ByteLengthQueuingStrategy({ highWaterMark: params.writableStreamHWM })
});

var start = Date.now();
rs.pipeTo(ws).closed.then(() => {
    console.log('all data piped', Date.now() - start);
});
