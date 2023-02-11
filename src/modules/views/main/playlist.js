import { html } from './../../utils/dom.js';

function isPlaying(store, item) {
  return 'id' in item && store.playing && 'id' in store.playing && store.playing.id === item.id;
}

function getTitle(i18n, item) {
  return item.title || item.label || i18n.getMessage('mainPlaylistNoTitle');
}

function getSubTitle(item) {
  return 'artist' in item && item.artist.length > 0 ? item.artist[0] : item.file;
}

export default (store, i18n) => {
  const list = store.playlist.items;

  if (list.length === 0) {
    return html`
      <div class="c-section__content">
        <p>${i18n.getMessage('mainPlaylistEmpty')}</p>
      </div>
    `;
  }

  return html`
    <div class="c-playlist">
      <ul>
        ${list.map(
          (item, index) =>
            html`
              <li class="c-playlist__item ${isPlaying(store, item) ? 'c-playlist__item--playing' : ''}">
                <span class="c-playlist__title c-playlist--text-ellipsis" title="${getTitle(i18n, item)}"
                  >${getTitle(i18n, item)}</span
                >
                <span class="c-playlist__subtitle c-playlist--text-ellipsis" title="${getSubTitle(item)}"
                  >${getSubTitle(item)}</span
                >
                <span class="c-playlist__actions">
                  <button
                    @click="${() => store.actions.playItem(index)}"
                    title="${i18n.getMessage('mainControlsPlay')}"
                    class="c-playlist__button"
                  >
                    ►
                  </button>
                  <button
                    @click="${() => store.actions.removeItem(index)}"
                    title="${i18n.getMessage('mainControlsRemove')}"
                    class="c-playlist__button"
                  >
                    ⨯
                  </button>
                </span>
              </li>
            `
        )}
      </ul>
    </div>
  `;
};
