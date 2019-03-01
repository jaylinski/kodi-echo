import controls from './main/controls.js';
import devices from './main/devices.js';
import help from './main/help.js';
import options from './main/options.js';
import playlist from './main/playlist.js';
import { html } from './../utils/dom.js';

function getClass(store, route) {
  return store.route === route ? 'c-nav__link c-nav__link--active' : 'c-nav__link';
}

function showRoute(store, route) {
  return store.route === route ? 'c-section--active' : '';
}

export default (store, i18n) => html`
  <nav class="c-nav">
    <a
      @click="${() => store.commit('route', 'controls')}"
      href="#"
      title="${i18n.getMessage('navControls')}"
      class="${getClass(store, 'controls')}"
    >
      <svg viewBox="0 0 24 24"><use href="/assets/symbols.svg#controls"></use></svg>
    </a>
    <a
      @click="${() => store.commit('route', 'playlist')}"
      href="#"
      title="${i18n.getMessage('navPlaylist')}"
      class="${getClass(store, 'playlist')}"
    >
      <svg viewBox="0 0 24 24"><use href="/assets/symbols.svg#playlist"></use></svg>
    </a>
    <a
      @click="${() => store.commit('route', 'devices')}"
      href="#"
      title="${i18n.getMessage('navDevices')}"
      class="${getClass(store, 'devices')}"
    >
      <svg viewBox="0 0 24 24"><use href="/assets/symbols.svg#devices"></use></svg>
    </a>
    <a
      @click="${() => store.commit('route', 'options')}"
      href="#"
      title="${i18n.getMessage('navOptions')}"
      class="${getClass(store, 'options')}"
    >
      <svg viewBox="0 0 24 24"><use href="/assets/symbols.svg#options"></use></svg>
    </a>
  </nav>
  <main class="c-main">
    <section class="c-section ${showRoute(store, 'controls')}">${controls(store, i18n)}</section>
    <section class="c-section ${showRoute(store, 'playlist')}">${playlist(store, i18n)}</section>
    <section class="c-section ${showRoute(store, 'devices')}">${devices(store, i18n)}</section>
    <section class="c-section ${showRoute(store, 'options')}">${options(store, i18n)}</section>
    <section class="c-section ${showRoute(store, 'help')}">${help(i18n)}</section>
  </main>
`;
