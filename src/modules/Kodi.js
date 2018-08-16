import WebSocketApi from './WebSocketApi.js';
import { getActiveTab } from './../utils/tabs.js';
import { getLocal, setLocal } from './../utils/storage.js';
import { getPluginByUrl } from './plugin.js';

export default class Kodi {
  constructor(app, options) {
    this.app = app;
    this.options = options;
    this.api = new WebSocketApi(options);

    if (this.app !== 'background') this.listeners(); // TODO Get rid of "app" or mock it?

    this.api.connect().then(async () => {
      if (this.app !== 'background') await this.sync(); // TODO Get rid of "app" or mock it?
      // TODO Activate controls *after* sync to avoid conflicts?
    });
  }

  listeners() {
    this.app.addEventListener('kodi.share.click', async () => {
      const activeTab = await getActiveTab();
      await this.share(new URL(activeTab.url));
    });
    this.app.addEventListener('kodi.volume.set', async (event) => {
      this.app.store.commit('volume', event.detail);
      await this.setVolume(event.detail);
    });
    this.app.addEventListener('kodi.volume.mute', async () => {
      const mute = this.app.store.commit('muted', (muted) => !muted);
      await this.setMute(mute);
    });
    this.app.addEventListener('kodi.player.repeat', async () => {
      await this.setRepeat();
      const props = await this.api.send('Player.GetProperties', [1, ['repeat']]);
      this.app.store.commit('repeat', props.repeat);
    });
    this.app.addEventListener('kodi.player.shuffle', async () => {
      await this.setShuffle();
      const props = await this.api.send('Player.GetProperties', [1, ['shuffle']]);
      this.app.store.commit('shuffle', props.shuffle);
    });
    this.api.addEventListener('api.connected', (event) => {
      this.app.store.commit('apiConnected', event.detail);
    });
    this.api.addEventListener('api.active', (event) => {
      this.app.store.commit('apiActive', event.detail);
    });
  }

  /**
   * Synchronize state with Kodi.
   *
   * @returns {Promise<void>}
   */
  async sync() {
    try {
      // Get properties and update UI.
      const appProps = await this.api.send('Application.GetProperties', [['volume', 'muted']]);
      this.app.store.commit('volume', appProps.volume);
      this.app.store.commit('muted', appProps.muted);

      const playerProps = await this.api.send('Player.GetProperties', [1, ['shuffled', 'repeat']]);
      this.app.store.commit('shuffle', playerProps.shuffled);
      this.app.store.commit('repeat', playerProps.repeat);

      // TODO We could also use the thumbnail, but a request to a third party would be made. #privacy
      const playing = await this.api.send('Player.GetItem', [1, ['title']]);
      this.app.store.commit('playing', playing.item.title !== '' ? playing.item : false);

      // Listen for events from Kodi.
      this.api.listen('Application.OnVolumeChanged', (message) => {
        this.app.store.commit('volume', message.volume);
        this.app.store.commit('muted', message.muted);
      });
      this.api.listen('Player.OnPlay', async () => {
        // We have to send an extra request because the event doesn't provide all information.
        const playing = await this.api.send('Player.GetItem', [1, ['title']]);
        this.app.store.commit('playing', playing.item.title !== '' ? playing.item : false);
      });
      this.api.listen('Player.OnStop', () => {
        this.app.store.commit('playing', false);
      });
    } catch (error) {
      this.app.store.commit('pluginError', error);
    }
  }

  async share(url) {
    try {
      const plugin = getPluginByUrl(url);
      const pluginPath = await plugin.getPluginPath({ url });

      try {
        plugin.stopCurrentlyPlayingMedia(); // TODO An interface would be nice.
      } catch (error) {
        console.warn(error);
      }

      await this.play(pluginPath);
    } catch (error) {
      if (this.app !== 'background') this.app.store.commit('pluginError', error); // TODO Get rid of "app" or mock it?
    }
  }

  async play(file) {
    await setLocal({ lastPlayed: file });
    await this.api.send('Playlist.Clear', { playlistid: 1 });
    await this.api.send('Playlist.Add', { playlistid: 1, item: { file } });
    await this.api.send('Player.Open', { item: { playlistid: 1, position: 0 } });
  }

  async replay() {
    const file = await getLocal('lastPlayed');
    await this.play(file.lastPlayed);
  }

  async setVolume(volume) {
    await this.api.send('Application.SetVolume', { volume });
  }

  async setMute(mute) {
    await this.api.send('Application.SetMute', { mute });
  }

  async setRepeat() {
    await this.api.send('Player.SetRepeat', [1, 'cycle']);
  }

  async setShuffle() {
    await this.api.send('Player.SetShuffle', [1, 'toggle']);
  }
}
