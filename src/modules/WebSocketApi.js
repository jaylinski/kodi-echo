const JSON_RPC_VERSION = '2.0';

export default class WebSocketApi extends EventTarget {
  constructor(options) {
    super();

    this.auth = options.user ? `${options.user}:${options.password}@` : false;
    this.host = `${options.ip}:${options.port}`;
  }

  async connect() {
    this.socket = new WebSocket(`ws://${this.auth || ''}${this.host}/jsonrpc`);
    this.setActive(true);

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.debug('Socket recv', data.method, data);
        this.dispatchEvent(new CustomEvent('onmessage', { detail: data }));
        this.dispatchEvent(new CustomEvent(data.method, { detail: data }));
      } catch (error) {
        console.error(error);
      }
    };

    return new Promise((resolve, reject) => {
      this.socket.onopen = (event) => {
        this.setStatus(true);
        this.setActive(false);
        resolve(event);
      };
      this.socket.onclose = (event) => {
        this.setStatus(false);
        this.setActive(false);
        reject(event);
      };
      this.socket.onerror = (event) => {
        this.setStatus(false);
        this.setActive(false);
        reject(event);
      };
    });
  }

  setStatus(status) {
    this.dispatchEvent(new CustomEvent('api.connected', { detail: status }));
  }

  setActive(status) {
    this.dispatchEvent(new CustomEvent('api.active', { detail: status }));
  }

  async send(method, payload = {}) {
    console.debug('Socket send', method, payload);

    const requestPromise = new Promise((resolve, reject) => {
      this.addEventListener('onmessage', (event) => {
        const data = event.detail;

        if ('result' in data || data.error) this.setActive(false);
        if (data.error) {
          reject(new Error(JSON.stringify(data.error)));
        } else if ('result' in data) {
          resolve(data.result);
        }
      });
    });

    this.setActive(true);
    this.socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method,
        params: payload,
        id: null,
      })
    );

    return requestPromise;
  }

  /**
   * Listen to an event from Kodi.
   *
   * This is convenience method. By using this method instead of `addEventListener()`
   * we don't have to handle the JSON nesting from Kodi responses.
   *
   * @param method
   * @param callback
   */
  listen(method, callback) {
    this.addEventListener(method, (event) => callback(event.detail.params.data));
  }
}
