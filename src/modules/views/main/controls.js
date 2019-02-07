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

      const progressBar = document.querySelector('.c-progress__bar');
      if (progressBar) {
        const duration = progress.duration.hours * 3600 + progress.duration.minutes * 60 + progress.duration.seconds;
        progressBar.setAttribute('style', `transform:scaleX(${currentTime / duration})`);
      }

      const progressTiming = document.querySelector('.c-progress__timing-current');
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
  <div class="c-progress__bar"></div>
  <div class="c-progress__timing">
    <span class="c-progress__timing-current">
      ${
        progress.time.hours ? progress.time.hours.toString().concat(':') : ''
      }${progress.time.minutes.toString().padStart(2, '0')}:${progress.time.seconds.toString().padStart(2, '0')}
    </span>
    <span class="c-progress__timing-divider">/</span>
    <span class="c-progress__timing-duration">
      ${
        progress.duration.hours ? progress.duration.hours.toString().concat(':') : ''
      }${progress.duration.minutes.toString().padStart(2, '0')}:${progress.duration.seconds.toString().padStart(2, '0')}
    </span>
  </div>
</div>`;
}

export default (store, i18n) => `
<div class="c-section__content">
  <ul class="c-share">
    <li class="c-share__now">
      <button id="share" class="c-share__button">${i18n.getMessage('mainControlsPlay')}</button>
    </li>
    <li class="c-share__more">
      <button class="c-share__button">⁝</button>
      <ul class="c-share__dropdown">
        <li>
          <button id="share" class="c-share__button">${i18n.getMessage('mainControlsQueue')}</button>
        </li>
      </ul>
    </li>
  </ul>
  <div class="c-controls">
    <div class="c-controls__previous">
      <button class="c-controls__button" title="${i18n.getMessage('mainControlsPrev')}">⏮</button>
    </div>
    <div class="c-controls__playpause">
      <button class="c-controls__button" title="${i18n.getMessage('mainControlsPause')}">${
  store.paused ? '►' : '⏸'
}</button>
    </div>
    <div class="c-controls__stop">
      <button class="c-controls__button" title="${i18n.getMessage('mainControlsStop')}">⏹</button>
    </div>
    <div class="c-controls__next">
      <button class="c-controls__button" title="${i18n.getMessage('mainControlsNext')}">⏭</button>
    </div>
  </div>
  <div class="c-controls">
    <div class="c-controls__volume">
      <input type="range" min="0" max="100" value="${store.volume}" title="${i18n.getMessage('mainControlsVolumne')}">
    </div>
    <div class="c-controls__mute ${store.muted ? 'c-controls__active' : ''}">
        <button class="c-controls__button" title="${i18n.getMessage('mainControlsMute')}">🔇</button>
    </div>
    <div class="c-controls__repeat ${store.repeat !== 'off' ? 'c-controls__active' : ''} ${
  store.repeat === 'one' ? 'c-controls__repeat__one' : ''
}">
      <button class="c-controls__button" title="${i18n.getMessage('mainControlsRepeat')}">🔁</button>
    </div>
    <div class="c-controls__shuffle ${store.shuffled ? 'c-controls__active' : ''}">
      <button class="c-controls__button" title="${i18n.getMessage('mainControlsShuffle')}">🔀</button>
    </div>
  </div>
</div>
${store.playing ? progress(store.progress) : ''}`;
