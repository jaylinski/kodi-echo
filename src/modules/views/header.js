function getTitle(store) {
  return store.playing ? store.playing.label || store.playing.title : '';
}

export default (store) => `
<div class="c-header">
  <div class="c-header--logo">
    <img src="/assets/icon-48.png" alt="Kodi Logo">
  </div>
  <div class="c-header--playing" title="${getTitle(store)}">
    ${getTitle(store)}
  </div>
</div>`;
