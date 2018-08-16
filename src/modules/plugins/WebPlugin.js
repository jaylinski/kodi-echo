export default class WebPlugin {
  constructor() {
    this.domains = [];
  }

  /**
   * Check if the plugin owns a domain.
   *
   * @param {string} hostname
   * @returns {boolean}
   */
  ownsUrl(hostname) {
    return this.domains.find((domain) => hostname.match(domain) !== null) !== undefined;
  }
}
