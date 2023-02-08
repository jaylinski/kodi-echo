import Kodi from './Kodi.js';
import { getActiveTab } from './utils/tabs.js';
import { requestPermissions } from './utils/permissions.js';

export default class Store extends EventTarget {
  constructor({ options }) {
    super();

    this.options = options;
    this.kodi = new Kodi();
    this.kodi.connect(this.options.devices[0]);
    this.sync();

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
    this.playlist = {
      id: 0,
      items: [],
    };

    // Actions
    this.actions = {
      mute: () => this.kodi.setMute(!this.muted),
      next: () => this.kodi.goTo('next'),
      pause: () => this.kodi.playPause(),
      playItem: (position) => this.kodi.goTo(position),
      prev: () => this.kodi.goTo('previous'),
      queue: async () => {
        try {
          const activeTab = await getActiveTab();
          await this.kodi.queue(new URL(activeTab.url));
        } catch (error) {
          this.commit('apiError', error);
        }
      },
      removeItem: (position) => this.kodi.remove(position),
      repeat: async () => {
        await this.kodi.setRepeat();
        await this.kodi.sync();
      },
      seek: async (event) => {
        const percentage = Math.round((event.layerX / event.currentTarget.offsetWidth) * 100);
        await this.kodi.seek(percentage);

        // Kodi fires the `Player.OnSeek`-event before `playerProps` are updated, so we have to sync manually.
        await new Promise((resolve) => setTimeout(resolve, 500));
        await this.kodi.sync();
      },
      share: async () => {
        try {
          const activeTab = await getActiveTab();
          await this.kodi.share(new URL(activeTab.url));
        } catch (error) {
          this.commit('apiError', error);
        }
      },
      shuffle: async () => {
        await this.kodi.setShuffle();
        await this.kodi.sync();
      },
      stop: () => this.kodi.stop(),
      updateDevice: async (options) => {
        this.options.devices[0] = options;
        await this.options.saveToStorage();
      },
      updateOptions: async (event) => {
        const option = event.target.dataset.option;
        this.options[option] = event.target.checked;
        this.commit('options', this.options); // Make sure that the DOM will be re-rendered.

        if (option === 'replayNotification') {
          try {
            const permissionGranted = await requestPermissions({ permissions: ['notifications'] });
            if (!permissionGranted) this.options[option] = false;
          } catch (error) {
            this.options[option] = false;
            console.error(error);
          }
        }

        await this.options.saveToStorage();
        this.commit('options', this.options);
      },
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
   * @returns {*}
   */
  commit(key, callback) {
    if (typeof callback === 'function') {
      this[key] = callback(this[key], this);
    } else {
      this[key] = callback;
    }

    this.dispatchEvent(new CustomEvent('store.updated'));

    return this[key];
  }

  /**
   * Sync with Kodi by listening for events.
   */
  sync() {
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
      this.commit('playlist', {
        id: syncData.playerProps.playlistid,
        items: syncData.playlist.items || [],
      });
      this.commit('progress', {
        time: syncData.playerProps.time,
        duration: syncData.playerProps.totaltime,
        percentage: syncData.playerProps.percentage,
      });
    });
  }
}
