export default (store) => `
<div class="c-header">
  <div class="c-header--logo">
    <img src="/assets/icon-48.png" alt="Kodi Logo">
  </div>
  <div class="c-header--playing" title="${store.playing ? store.playing.title : ''}">
    ${store.playing ? store.playing.title : ''}
  </div>
  <!--
  <div class="c-header--controls">
    <button class="c-header--control-previous" title="Previous">⏮</button>
    <button class="c-header--control-rewind" title="Rewind">⏪</button>
    <button class="c-header--control-pause" title="Pause">⏸</button>
    <button class="c-header--control-stop" title="Stop">⏹</button>
    <button class="c-header--control-play" title="Play">►</button>
    <button class="c-header--control-forward" title="Fast forward">⏩</button>
    <button class="c-header--control-next" title="Next">⏭</button>
  </div>
  -->
</div>`;
