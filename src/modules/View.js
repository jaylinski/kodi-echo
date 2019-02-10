import footer from './views/footer.js';
import header from './views/header.js';
import main from './views/main.js';
import setup from './views/setup.js';
import status from './views/status.js';
import { getBrowser } from './utils/browser.js';
import { html, render } from './utils/dom.js';

const browser = getBrowser();

export default class View extends EventTarget {
  constructor({ root, store }) {
    super();

    this.root = root;
    this.store = store;
    this.i18n = browser.i18n;
    this.manifest = browser.runtime.getManifest();

    store.subscribe(this.render.bind(this));

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
    // If no options are set, show the user a link to the options page.
    if (!store.options.ip) return setup(i18n);

    return html`
      ${header(store)} ${status(store, i18n)} ${main(store, i18n)} ${footer(store, i18n, manifest)}
    `;
  }
}
