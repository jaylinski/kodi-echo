/**
 * We should actually commit the calculated percentage to the store,
 * but since we have no DOM diffing, this would result in re-rendering every
 * second (which sucks performance wise) and would also make CSS animations impossible.
 *
 * @param {object} progress
 */
function calculateProgress(progress) {
  clearInterval(window.progressInterval);
  window.progressInterval = setInterval(() => {
    if (progress) {
      const time = progress.time.hours * 3600 + progress.time.minutes * 60 + progress.time.seconds;
      const timeDiff = (Date.now() - progress.current) / 1000;
      const currentTime = time + timeDiff;

      const progressBar = document.querySelector('.c-progress--bar');
      if (progressBar) {
        const duration = progress.duration.hours * 3600 + progress.duration.minutes * 60 + progress.duration.seconds;
        progressBar.setAttribute('style', `transform:scaleX(${currentTime / duration})`);
      }

      const progressTiming = document.querySelector('.c-progress--timing-current');
      if (progressTiming) {
        const hours = Math.floor(currentTime / 3600);
        const minutes = Math.floor((currentTime - hours * 3600) / 60);
        const seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);
        progressTiming.textContent = `${hours ? hours.toString().concat(':') : ''}${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  }, 1000);
}

function progress(progress) {
  calculateProgress(progress);
  return `
<div class="c-progress">
  <div class="c-progress--bar"></div>
  <div class="c-progress--timing">
    <span class="c-progress--timing-current">
      ${
        progress.time.hours ? progress.time.hours.toString().concat(':') : ''
      }${progress.time.minutes.toString().padStart(2, '0')}:${progress.time.seconds.toString().padStart(2, '0')}
    </span>
    <span class="c-progress--timing-divider">/</span>
    <span class="c-progress--timing-duration">
      ${
        progress.duration.hours ? progress.duration.hours.toString().concat(':') : ''
      }${progress.duration.minutes.toString().padStart(2, '0')}:${progress.duration.seconds.toString().padStart(2, '0')}
    </span>
  </div>
</div>`;
}

export default (store) => `
<div class="c-body--controls-container">
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
</div>
${store.playing ? progress(store.progress) : ''}`;
