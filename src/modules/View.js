import footer from './views/footer.js';
import header from './views/header.js';
import main from './views/main.js';
import setup from './views/setup.js';
import status from './views/status.js';
import { getBrowser } from './../utils/browser.js';

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
    this.root.innerHTML = this.template({
      store: this.store,
      i18n: this.i18n,
      manifest: this.manifest,
    });

    this.actions();
    this.dispatchEvent(new CustomEvent('render.after'));
  }

  template({ store, i18n, manifest }) {
    // If no options are set, show the user a link to the options page.
    if (!store.options.ip) return setup(i18n);

    return `
      ${header(store)}
      ${status(store, i18n)}
      ${main(store, i18n)}
      ${footer(i18n, manifest)}
    `;
  }

  actions() {
    document.getElementById('open-options').addEventListener('click', (event) => {
      event.preventDefault();
      browser.runtime.openOptionsPage();
    });

    const routes = document.querySelectorAll('.c-nav__link');
    routes.forEach((route) => {
      route.addEventListener('click', () => {
        this.store.commit('route', route.dataset.route);
      });
    });

    document.querySelector('#share').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.share.click'));
    });
    document.querySelector('.c-controls__playpause').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.player.playpause'));
    });
    document.querySelector('.c-controls__stop').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.player.stop'));
    });
    document.querySelector('.c-controls__previous').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.player.goto.previous'));
    });
    document.querySelector('.c-controls__next').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.player.goto.next'));
    });
    document.querySelector('.c-controls__volume').addEventListener('change', (event) => {
      this.dispatchEvent(new CustomEvent('kodi.volume.set', { detail: event.target.valueAsNumber }));
    });
    document.querySelector('.c-controls__mute').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.volume.mute'));
    });
    document.querySelector('.c-controls__repeat').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.player.repeat'));
    });
    document.querySelector('.c-controls__shuffle').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('kodi.player.shuffle'));
    });
  }
}
