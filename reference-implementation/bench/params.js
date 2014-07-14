export default {
//  totalSize: 16 * 1024 * 1024 * 1024,
  totalSize: 16 * 1024,

  underlyingSourceRate: 300,
  underlyingSourceChunkSize: 1024,
  readableStreamHWM: 16 * 1024,

  transformSpeed: 100,
  transformSizeMultiplier: 1,
  transformInputHWM: 16 * 1024,
  transformOutputHWM: 16 * 1024,

  writableStreamHWM: 16 * 1024,
  underlyingSinkConsumptionSpeed: 200
};
