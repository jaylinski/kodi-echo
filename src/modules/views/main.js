import controls from './main/controls.js';
import help from './main/help.js';
import playlist from './main/playlist.js';
import { html } from './../utils/dom.js';

function getClass(store, route) {
  return store.route === route ? 'c-nav__link c-nav__link--active' : 'c-nav__link';
}

function showRoute(store, route) {
  return store.route === route ? 'c-section--active' : '';
}

export default (store, i18n) => html`
  <div class="c-body">
    <nav class="c-body__nav c-nav">
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
    </nav>
    <main class="c-body__main">
      <section class="c-section ${showRoute(store, 'controls')}">${controls(store, i18n)}</section>
      <section class="c-section ${showRoute(store, 'playlist')}">${playlist(store)}</section>
      <section class="c-section ${showRoute(store, 'help')}">${help(i18n)}</section>
    </main>
  </div>
`;
