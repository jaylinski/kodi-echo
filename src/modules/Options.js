import { getLocal, setLocal } from './utils/storage.js';

const WEBSOCKET_DEFAULT_PORT = 9090;

export default class Options {
  constructor() {
    this.devices = [
      {
        name: '',
        ip: '',
        port: WEBSOCKET_DEFAULT_PORT,
        user: '',
        password: '',
      },
    ];
    this.replayNotifications = false;
  }

  async getFormStorage() {
    try {
      const { options } = await getLocal('options');

      this.devices[0].name = options.devices[0].name || '';
      this.devices[0].ip = options.devices[0].ip || '';
      this.devices[0].port = options.devices[0].port || WEBSOCKET_DEFAULT_PORT;
      this.devices[0].user = options.devices[0].user || '';
      this.devices[0].password = options.devices[0].password || '';
    } catch (e) {
      // There are no options set yet.
      // Since we provide default `null` values this is okay.
    }
  }

  async saveToStorage() {
    console.debug(this.devices);
    await setLocal({
      options: {
        devices: this.devices,
        replayNotifications: this.replayNotifications,
      },
    });
  }
}
