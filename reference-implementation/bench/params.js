var byteSize = require('byte-size');

export var formatters = {
  underlyingSourceChunks: x => x,
  underlyingSourceChunkSize: bytes,
  underlyingSourceRate: rates,
  readableStreamHWM: bytes,
  transformRate: rates,
  transformSizeMultiplier: times,
  transformInputHWM: bytes,
  transformOutputHWM: bytes,
  writableStreamHWM: bytes,
  underlyingSinkRate: rates
};

export var names = {
  underlyingSourceChunks: 'Underlying Source Chunks Produced',
  underlyingSourceChunkSize: 'Underlying Source Chunk Size',
  underlyingSourceRate: 'Underlying Source Production Rate',
  readableStreamHWM: 'Readable Stream HWM',
  transformRate: 'Transformation Rate',
  transformSizeMultiplier: 'Transformation Size Multiplier',
  transformInputHWM: 'Transform Stream Input HWM',
  transformOutputHWM: 'Transform Stream Output HWM',
  writableStreamHWM: 'Writable Stream HWM',
  underlyingSinkRate: 'Underlying Sink Consumption Rate'
};

// TODO: need to figure out realistic possibilities. This takes too long.
// Either do a in-development subset, or make the rates faster, or reduce the possibilities.
export var exhaustivePossibilities = {
  underlyingSourceChunks: [1, 8, 32],
  underlyingSourceChunkSize: [128, 512, 1024, 2 * 1024],
  underlyingSourceRate: [0, 5, 20],
  readableStreamHWM: [0, 1024, 16 * 1024],
  transformRate: [0, 5, 20],
  transformSizeMultiplier: [0.1, 0.5, 1, 1.5, 2, 5],
  transformInputHWM: [0, 1024, 16 * 1024],
  transformOutputHWM: [0, 1024, 16 * 1024],
  writableStreamHWM: [0, 1024, 16 * 1024],
  underlyingSinkRate: [0, 5, 20]
};

export var quickTestPossibilities = {
  underlyingSourceChunks: [1, 32],
  underlyingSourceChunkSize: [1024],
  underlyingSourceRate: [0, 15, 30],
  readableStreamHWM: [0, 8 * 1024],
  transformRate: [0, 15, 30],
  transformSizeMultiplier: [0.3, 2],
  transformInputHWM: [0],
  transformOutputHWM: [0],
  writableStreamHWM: [0, 8 * 1024],
  underlyingSinkRate: [0, 15, 30]
};

export var keys = Object.keys(formatters);

function rates(value) {
  return `1/${value} ms`;
}

function times(value) {
  return value + 'x';
}

function bytes(value) {
  return byteSize(value, 3);
}

// TODO: allow sync/async consumption
