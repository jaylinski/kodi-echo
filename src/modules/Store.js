export default class Store extends EventTarget {
  constructor({ options }) {
    super();

    this.subscriber = () => null;
    this.options = options;

    // Default values.
    this.apiConnected = true;
    this.apiActive = false;
    this.pluginError = false;
    this.playing = false;
    this.volume = 50;
    this.muted = false;
    this.repeat = false;
    this.shuffle = false;
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
