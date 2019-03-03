import { html } from './../../utils/dom.js';

const PROGRESS_UPDATE_INTERVAL = 1000; // Milliseconds

/**
 * Calculate the progress of the currently playing media.
 *
 * @param store
 */
function calculateProgress(store) {
  clearInterval(window.progressInterval);
  window.progressInterval = setInterval(() => {
    if (progress) {
      const progress = store.progress;
      const time = progress.time.hours * 3600 + progress.time.minutes * 60 + progress.time.seconds;
      const newTime = time + PROGRESS_UPDATE_INTERVAL / 1000;

      const hours = Math.floor(newTime / 3600);
      const minutes = Math.floor((newTime - hours * 3600) / 60);
      const seconds = Math.floor(newTime - hours * 3600 - minutes * 60);

      const progressBar = document.querySelector('.c-progress__bar');
      if (progressBar) {
        const duration = progress.duration.hours * 3600 + progress.duration.minutes * 60 + progress.duration.seconds;
        const limitedCurrentTime = time < duration ? time : duration;
        progressBar.setAttribute('style', `transform:scaleX(${limitedCurrentTime / duration})`);
      }

      progress.time.hours = hours;
      progress.time.minutes = minutes;
      progress.time.seconds = seconds;

      store.commit('progress', progress);
    }
  }, PROGRESS_UPDATE_INTERVAL);
}

function progress(store) {
  calculateProgress(store);
  const progress = store.progress;

  return html`
    <div @click="${store.actions.seek}" class="c-progress">
      <div class="c-progress__bar"></div>
      <div class="c-progress__timing">
        <span class="c-progress__timing-current">
          ${progress.time.hours
            ? progress.time.hours.toString().concat(':')
            : ''}${progress.time.minutes.toString().padStart(2, '0')}:${progress.time.seconds
            .toString()
            .padStart(2, '0')}
        </span>
        <span class="c-progress__timing-divider">/</span>
        <span class="c-progress__timing-duration">
          ${progress.duration.hours
            ? progress.duration.hours.toString().concat(':')
            : ''}${progress.duration.minutes
            .toString()
            .padStart(2, '0')}:${progress.duration.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  `;
}

export default (store, i18n) => {
  const renderAfterHandler = () => {
    const vol = document.querySelector('input[type=range]');
    vol.value = store.volume;
    document.removeEventListener('render.after', renderAfterHandler);
  };
  document.addEventListener('render.after', renderAfterHandler);

  return html`
    <div class="c-section__content">
      <ul class="c-share">
        <li class="c-share__now">
          <button @click="${store.actions.share}" id="share" class="c-share__button">
            ${i18n.getMessage('mainControlsPlay')}
          </button>
        </li>
        <li class="c-share__more">
          <button class="c-share__button">⁝</button>
          <ul class="c-share__dropdown">
            <li>
              <button @click="${store.actions.queue}" id="share" class="c-share__button c-share__button--dropdown">
                ${i18n.getMessage('mainControlsQueue')}
              </button>
            </li>
          </ul>
        </li>
      </ul>
      <div class="c-controls">
        <div class="c-controls__previous">
          <button
            @click="${store.actions.prev}"
            class="c-controls__button"
            title="${i18n.getMessage('mainControlsPrev')}"
          >
            ⏮
          </button>
        </div>
        <div class="c-controls__playpause">
          <button
            @click="${store.actions.pause}"
            class="c-controls__button"
            title="${i18n.getMessage('mainControlsPause')}"
          >
            ${store.paused ? '►' : '⏸'}
          </button>
        </div>
        <div class="c-controls__stop">
          <button
            @click="${store.actions.stop}"
            class="c-controls__button"
            title="${i18n.getMessage('mainControlsStop')}"
          >
            ⏹
          </button>
        </div>
        <div class="c-controls__next">
          <button
            @click="${store.actions.next}"
            class="c-controls__button"
            title="${i18n.getMessage('mainControlsNext')}"
          >
            ⏭
          </button>
        </div>
      </div>
      <div class="c-controls">
        <div>
          <button class="c-controls__button"><small>${Math.round(store.volume)}</small></button>
        </div>
        <div class="c-controls__mute ${store.muted ? 'c-controls--active' : ''}">
          <button
            @click="${store.actions.mute}"
            class="c-controls__button"
            title="${i18n.getMessage('mainControlsMute')}"
          >
            🔇
          </button>
        </div>
        <div
          class="c-controls__repeat ${store.repeat !== 'off' ? 'c-controls--active' : ''} ${store.repeat === 'one'
            ? 'c-controls__repeat__one'
            : ''}"
        >
          <button
            @click="${store.actions.repeat}"
            class="c-controls__button"
            title="${i18n.getMessage('mainControlsRepeat')}"
          >
            🔁
          </button>
        </div>
        <div class="c-controls__shuffle ${store.shuffled ? 'c-controls--active' : ''}">
          <button
            @click="${store.actions.shuffle}"
            class="c-controls__button"
            title="${i18n.getMessage('mainControlsShuffle')}"
          >
            🔀
          </button>
        </div>
      </div>
      <div class="c-controls">
        <div class="c-controls__volume">
          <input
            @change="${store.actions.volume}"
            type="range"
            min="0"
            max="100"
            value="${store.volume}"
            title="${i18n.getMessage('mainControlsVolume')}"
          />
        </div>
      </div>
    </div>
    ${store.playing && store.progress ? progress(store) : ''}
  `;
};
