import footer from './views/footer.js';
import header from './views/header.js';
import main from './views/main.js';
import status from './views/status.js';
import { getBrowser } from './utils/browser.js';
import { html, render } from './utils/dom.js';

const browser = getBrowser();

export default class View extends EventTarget {
  constructor({ root, store }) {
    super();

    this.root = root;
    this.store = store;
    this.store.addEventListener('store.updated', () => this.render());
    this.i18n = browser.i18n;
    this.manifest = browser.runtime.getManifest();

    this.render();
  }

  render() {
    const dom = this.template({
      store: this.store,
      i18n: this.i18n,
      manifest: this.manifest,
    });

    render(dom, this.root);
    document.dispatchEvent(new CustomEvent('render.after'));
  }

  template({ store, i18n, manifest }) {
    // If no device is configured, display the devices page.
    if (!store.options.devices[0].ip) store.route = 'devices';

    return html`
      ${header(store)} ${status(store, i18n)} ${main(store, i18n)} ${footer(store, i18n, manifest)}
    `;
  }
}
