export default class CountQueuingStrategy {
  constructor({ highWaterMark }) {
    highWaterMark = Number(highWaterMark);

    if (Number.isNaN(highWaterMark)) {
      throw new TypeError('highWaterMark must be a number.');
    }
    if (highWaterMark < 0) {
      throw new RangeError('highWaterMark must be nonnegative.');
    }

    this.highWaterMark = highWaterMark;
  }

  size(chunk) {
    return 1;
  }

  needsMore(queueSize) {
    return queueSize < this.highWaterMark;
  }
}
