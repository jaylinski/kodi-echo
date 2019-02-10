import Kodi from './Kodi.js';
import { getActiveTab } from './utils/tabs.js';

export default class Store extends EventTarget {
  constructor({ options }) {
    super();

    this.subscriber = () => null;
    this.options = options;
    this.kodi = new Kodi(options);
    this.receiveEvents();

    // Default values.
    this.apiConnected = true;
    this.apiActive = true;
    this.apiError = false;
    this.playing = false;
    this.paused = false;
    this.progress = false;
    this.volume = 50;
    this.muted = false;
    this.repeat = 'off';
    this.shuffled = false;
    this.route = 'controls';
    this.playlist = [];

    // Actions
    this.actions = {
      mute: () => this.kodi.setMute(!this.muted),
      next: () => this.kodi.setGoTo('next'),
      pause: () => this.kodi.setPlayPause(),
      prev: () => this.kodi.setGoTo('previous'),
      repeat: () => this.kodi.setRepeat(),
      share: async () => {
        try {
          const activeTab = await getActiveTab();
          await this.kodi.share(new URL(activeTab.url));
        } catch (error) {
          this.commit('apiError', error);
        }
      },
      shuffle: () => this.kodi.setShuffle(),
      stop: () => this.kodi.setStop(),
      volume: (event) => {
        this.commit('volume', event.target.valueAsNumber); // Set new volume instantly in order to avoid glitches.
        this.kodi.setVolume(event.target.valueAsNumber);
      },
    };
  }

  /**
   * Commit a new state to the store.
   *
   * @param key
   * @param callback
   * @param source Can be either `html` or `kodi`.
   * @returns {*}
   */
  commit(key, callback) {
    if (typeof callback === 'function') {
      this[key] = callback(this[key], this);
    } else {
      this[key] = callback;
    }

    this.subscriber.call();

    return this[key];
  }

  /**
   * Receive events from non-HTML sources.
   */
  receiveEvents() {
    this.kodi.addEventListener('api.active', (event) => {
      this.commit('apiActive', event.detail);
    });

    this.kodi.addEventListener('api.connected', (event) => {
      this.commit('apiConnected', event.detail);
    });

    this.kodi.addEventListener('api.error', (event) => {
      this.commit('apiError', event.detail);
    });

    this.kodi.addEventListener('sync', (event) => {
      const syncData = event.detail;

      this.commit('volume', syncData.appProps.volume);
      this.commit('muted', syncData.appProps.muted);
      this.commit('paused', !syncData.playerProps.speed);
      this.commit('shuffled', syncData.playerProps.shuffled);
      this.commit('repeat', syncData.playerProps.repeat);
      this.commit('playing', syncData.playing.item.label !== '' ? syncData.playing.item : false);
      this.commit('playlist', syncData.playlist.items || []);
      this.commit('progress', {
        time: syncData.playerProps.time,
        duration: syncData.playerProps.totaltime,
        percentage: syncData.playerProps.percentage,
      });
    });
  }

  subscribe(callback) {
    this.subscriber = callback;
  }
}
