export default class RandomPushSource {
  constructor(toPush) {
    this.pushed = 0;
    this.toPush = toPush;
    this.started = false;
    this.paused = false;
    this.closed = false;

    this._intervalHandle = null;
  }

  readStart() {
    if (this.closed) {
      return;
    }

    if (!this.started) {
      this._intervalHandle = setInterval(writeChunk, 23);
      this.started = true;
    }

    if (this.paused) {
      this._intervalHandle = setInterval(writeChunk, 23);
      this.paused = false;
    }

    var stream = this;
    function writeChunk() {
      if (stream.paused) {
        return;
      }

      stream.pushed++;

      if (stream.toPush > 0 && stream.pushed > stream.toPush) {
        if (stream._intervalHandle) {
          clearInterval(stream._intervalHandle);
          stream._intervalHandle = undefined;
        }
        stream.closed = true;
        stream.onend();
      }
      else {
        stream.ondata(randomChunk(128));
      }
    }
  }

  readStop() {
    if (this.paused) {
      return;
    }

    if (this.started) {
      this.paused = true;
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    } else {
      throw new Error('Can\'t pause reading an unstarted source.');
    }
  }
}

// http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
function randomChunk(size) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < size; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
