import WebSocketApi from './WebSocketApi.js';
import { getLocal, setLocal } from './utils/storage.js';
import { getPluginByUrl } from './plugin.js';

export default class Kodi extends EventTarget {
  constructor(options) {
    super();

    this.api = new WebSocketApi(options);
    this.activePlayerId = 0;

    this.listeners();

    this.api.connect().then(async () => {
      await this.sync();
    });
  }

  listeners() {
    // Listen for events about connectivity.
    this.api.addEventListener('api.connected', (event) => {
      this.dispatchEvent(new CustomEvent('api.connected', { detail: event.detail }));
    });
    this.api.addEventListener('api.active', (event) => {
      this.dispatchEvent(new CustomEvent('api.active', { detail: event.detail }));
    });

    // Listen for events from Kodi.
    // We could immediately use the sent information to update the store, but it easier to just do another sync.
    this.api.listen('Application.OnVolumeChanged', () => this.sync());
    this.api.listen('Player.OnPropertyChanged', () => this.sync());
    this.api.listen('Player.OnPlay', () => this.sync());
    this.api.listen('Player.OnPause', () => this.sync());
    this.api.listen('Player.OnStop', () => this.sync());
  }

  /**
   * Synchronize state with Kodi.
   *
   * @returns {Promise<void>}
   */
  async sync() {
    const appProps = await this.api.send('Application.GetProperties', [['volume', 'muted']]);
    const activePlayers = await this.api.send('Player.GetActivePlayers', []);
    this.activePlayerId = activePlayers.length > 0 ? activePlayers[0].playerid : 0;
    const playerProps = await this.api.send('Player.GetProperties', [
      this.activePlayerId,
      ['playlistid', 'shuffled', 'repeat', 'time', 'totaltime', 'percentage', 'speed'],
    ]);
    const playing = await this.api.send('Player.GetItem', [this.activePlayerId, []]);
    const playlist = await this.api.send('Playlist.GetItems', [
      playerProps.playlistid,
      ['title', 'artist', 'duration'],
    ]);

    this.dispatchEvent(
      new CustomEvent('sync', {
        detail: {
          appProps,
          playerProps,
          playing,
          playlist,
        },
      })
    );
  }

  async share(url) {
    const plugin = getPluginByUrl(url);
    const pluginPath = await plugin.getPluginPath({ url });

    try {
      plugin.stopCurrentlyPlayingMedia(); // TODO An interface would be nice (consider adoption of TypeScript).
    } catch (error) {
      console.warn(error);
    }

    await this.play(pluginPath);
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

  async setPlayPause() {
    await this.api.send('Player.PlayPause', [this.activePlayerId, 'toggle']);
  }

  async setStop() {
    await this.api.send('Player.Stop', [this.activePlayerId]);
  }

  async setGoTo(type) {
    await this.api.send('Player.GoTo', [this.activePlayerId, type]);
  }

  async setRepeat() {
    await this.api.send('Player.SetRepeat', [this.activePlayerId, 'cycle']);
  }

  async setShuffle() {
    await this.api.send('Player.SetShuffle', [this.activePlayerId, 'toggle']);
  }
}
