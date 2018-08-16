import { getLocal, setLocal } from './../utils/storage.js';

export default class Options {
  constructor() {
    this.ip = null;
    this.port = null;
    this.user = null;
    this.password = null;
  }

  async getFormStorage() {
    try {
      const { options } = await getLocal('options');

      this.ip = options.ip || null;
      this.port = options.port || 9090;
      this.user = options.user || null;
      this.password = options.password || null;
    } catch (e) {
      // There are no options set yet.
      // Since we provide default `null` values this is okay.
    }
  }

  async saveToStorage(options) {
    await setLocal({ options });
  }
}
