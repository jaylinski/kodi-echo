export default (store) => `
<div class="c-body">
  <div class="c-body--share">
    <button>Play</button>
  </div>
  <div class="c-body--controls">
    <div class="c-body--controls-previous">
      <button class="c-body--controls-button" title="Previous">⏮</button>
    </div>
    <div class="c-body--controls-playpause">
      <button class="c-body--controls-button" title="Play or pause">${store.paused ? '►' : '⏸'}</button>
    </div>
    <div class="c-body--controls-stop">
      <button class="c-body--controls-button" title="Stop">⏹</button>
    </div>
    <div class="c-body--controls-next">
      <button class="c-body--controls-button" title="Next">⏭</button>
    </div>
  </div>
  <div class="c-body--controls">
    <div class="c-body--controls-volume">
      <input type="range" min="0" max="100" value="${store.volume}" title="Volume">
    </div>
    <div class="c-body--controls-mute ${store.muted ? 'c-body--controls__active' : ''}">
        <button class="c-body--controls-button" title="Mute">🔇</button>
    </div>
    <div class="c-body--controls-repeat ${store.repeat !== 'off' ? 'c-body--controls__active' : ''} ${
  store.repeat === 'one' ? 'c-body--controls-repeat__one' : ''
}">
      <button class="c-body--controls-button" title="Repeat">🔁</button>
    </div>
    <div class="c-body--controls-shuffle ${store.shuffled ? 'c-body--controls__active' : ''}">
      <button class="c-body--controls-button" title="Shuffle">🔀</button>
    </div>
  </div>
  <div class="c-body--status">
    <p></p>
  </div>
</div>`;
