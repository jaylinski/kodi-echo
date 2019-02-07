import controls from './main/controls.js';
import playlist from './main/playlist.js';

function getClass(store, route) {
  return store.route === route ? 'c-nav__link c-nav__link--active' : 'c-nav__link';
}

function showRoute(store, route) {
  return store.route === route ? 'c-section--active' : '';
}

export default (store, i18n) => `
<div class="c-body">
  <nav class="c-body__nav c-nav"> 
    <a href="#" title="${i18n.getMessage('navControls')}" class="${getClass(store, 'controls')}" data-route="controls">
      <svg viewBox="0 0 24 24">
        <use href="/assets/symbols.svg#controls"></use>
      </svg>
    </a>
    <a href="#" title="${i18n.getMessage('navPlaylist')}" class="${getClass(store, 'playlist')}" data-route="playlist">
      <svg viewBox="0 0 24 24">
        <use href="/assets/symbols.svg#playlist"></use>
      </svg>
    </a>
  </nav>
  <main class="c-body__main">
    <section class="c-section ${showRoute(store, 'controls')}" > 
      ${controls(store, i18n)}
    </section>
    <section class="c-section ${showRoute(store, 'playlist')}" >
      ${playlist(store)}
    </section>
  </main>
</div>`;
