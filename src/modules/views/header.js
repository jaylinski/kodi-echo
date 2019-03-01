import { html } from './../utils/dom.js';

function getTitle(store) {
  return store.playing ? store.playing.label || store.playing.title : '';
}

export default (store) => html`
  <div class="c-logo">
    <div><img src="/assets/icon-48.png" alt="Kodi Logo" /></div>
  </div>
  <div class="c-header" title="${getTitle(store)}">
    <div class="c-header__title">${getTitle(store)}</div>
  </div>
`;
