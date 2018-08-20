export default (store) => `
<div class="c-header">
  <div class="c-header--logo">
    <img src="/assets/icon-48.png" alt="Kodi Logo">
  </div>
  <div class="c-header--playing" title="${store.playing ? store.playing.label : ''}">
    ${store.playing ? store.playing.label || store.playing.title : ''}
  </div>
</div>`;
