const JSON_RPC_VERSION = '2.0';

export default class WebSocketApi extends EventTarget {
  constructor() {
    super();

    this.apid = 100;
    this.socket = {};
  }

  async connect(options) {
    const auth = options.user ? `${options.user}:${options.password}@` : false;
    const host = `${options.ip}:${options.port}`;

    this.closeExistingConnection();
    this.socket = new WebSocket(`ws://${auth || ''}${host}/jsonrpc`);
    this.setActive(true);

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.debug('Socket recv', data.id, data.method, data);
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
        reject(new Error(event.type));
      };
      this.socket.onerror = (event) => {
        this.setStatus(false);
        this.setActive(false);
        reject(new Error(event.type));
      };
    });
  }

  /**
   * Close existing connection.
   *
   * Calling this function prevents multiple open WebSocket connections.
   */
  closeExistingConnection() {
    if ('close' in this.socket) this.socket.close();
  }

  /**
   * Returns a unique ID to send to the API.
   *
   * @returns {number}
   */
  getApiId() {
    return this.apid++;
  }

  setStatus(status) {
    this.dispatchEvent(new CustomEvent('api.connected', { detail: status }));
  }

  setActive(status) {
    this.dispatchEvent(new CustomEvent('api.active', { detail: status }));
  }

  async send(method, payload = {}) {
    const id = this.getApiId();

    console.debug('Socket send', id, method, payload);

    const requestPromise = new Promise((resolve, reject) => {
      const handler = (event) => {
        const data = event.detail;

        if ('result' in data && data.id !== id) return; // Discard out of order messages.
        if ('result' in data || data.error) this.setActive(false);
        if (data.error) {
          this.removeEventListener('onmessage', handler);
          reject(new Error(JSON.stringify(data.error)));
        } else if ('result' in data) {
          this.removeEventListener('onmessage', handler);
          resolve(data.result);
        }
      };
      this.addEventListener('onmessage', handler);
    });

    this.setActive(true);
    this.socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method,
        params: payload,
        id,
      })
    );

    return requestPromise;
  }

  /**
   * Listen to an event from Kodi.
   *
   * This is a convenience method. By using this method instead of `addEventListener()`
   * we don't have to handle the JSON nesting from Kodi responses.
   *
   * @param {string} method
   * @param {function} callback
   */
  listen(method, callback) {
    this.addEventListener(method, (event) => callback(event.detail.params.data));
  }
}
