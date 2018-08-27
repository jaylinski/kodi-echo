export default class Store extends EventTarget {
  constructor({ options }) {
    super();

    this.subscriber = () => null;
    this.options = options;

    // Default values.
    this.apiConnected = true;
    this.apiActive = false;
    this.apiError = false;
    this.playing = false;
    this.paused = false;
    this.progress = false;
    this.volume = 50;
    this.muted = false;
    this.repeat = 'off';
    this.shuffled = false;
    this.route = 'controls';
  }

  commit(key, callback) {
    if (typeof callback === 'function') {
      this[key] = callback(this[key]);
    } else {
      this[key] = callback;
    }

    this.subscriber.call();

    return this[key];
  }

  subscribe(callback) {
    this.subscriber = callback;
  }
}
