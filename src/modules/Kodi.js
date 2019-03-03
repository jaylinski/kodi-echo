import WebSocketApi from './WebSocketApi.js';
import { getLocal, setLocal } from './utils/storage.js';
import { getPluginByUrl } from './plugin.js';

export default class Kodi extends EventTarget {
  constructor(options) {
    super();

    this.api = new WebSocketApi(options);
    this.activePlayerId = 0;
    this.activePlaylistId = 0;

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
    this.api.listen('Player.OnSeek', () => this.sync());
    this.api.listen('Player.OnStop', () => this.sync());
    this.api.listen('Playlist.OnAdd', () => this.sync());
    this.api.listen('Playlist.OnRemove', () => this.sync());
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
    this.activePlaylistId = playerProps.playlistid;
    const playing = await this.api.send('Player.GetItem', [this.activePlayerId, []]);
    const playlist = await this.api.send('Playlist.GetItems', [
      this.activePlaylistId,
      ['title', 'artist', 'duration', 'file'],
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

  /**
   * @param {URL} url
   * @returns {Promise<void>}
   */
  async share(url) {
    const plugin = getPluginByUrl(url);
    const file = await plugin.getPluginPath({ url });

    await setLocal({ lastPlayed: file });

    try {
      plugin.stopCurrentlyPlayingMedia(); // TODO An interface would be nice (consider adoption of TypeScript).
    } catch (error) {
      console.warn(error);
    }

    await this.clear();
    await this.add(file);
    await this.play();
  }

  async queue(url) {
    const plugin = getPluginByUrl(url);
    const file = await plugin.getPluginPath({ url });

    await this.add(file);
  }

  async play(position = 0) {
    await this.api.send('Player.Open', { item: { playlistid: this.activePlaylistId, position } });
  }

  async replay() {
    const file = await getLocal('lastPlayed');

    await this.clear();
    await this.add(file.lastPlayed);
    await this.play();
  }

  async playPause() {
    await this.api.send('Player.PlayPause', [this.activePlayerId, 'toggle']);
  }

  async stop() {
    await this.api.send('Player.Stop', [this.activePlayerId]);
  }

  async goTo(to) {
    await this.api.send('Player.GoTo', [this.activePlayerId, to]);
  }

  async seek(percentage) {
    await this.api.send('Player.seek', [this.activePlayerId, percentage]);
  }

  async add(file) {
    await this.api.send('Playlist.Add', { playlistid: this.activePlaylistId, item: { file } });
  }

  async remove(position) {
    await this.api.send('Playlist.Remove', { playlistid: this.activePlaylistId, position });
  }

  async clear() {
    await this.api.send('Playlist.Clear', { playlistid: this.activePlaylistId });
  }

  async setVolume(volume) {
    await this.api.send('Application.SetVolume', { volume });
  }

  async setMute(mute) {
    await this.api.send('Application.SetMute', { mute });
  }

  async setRepeat() {
    await this.api.send('Player.SetRepeat', [this.activePlayerId, 'cycle']);
  }

  async setShuffle() {
    await this.api.send('Player.SetShuffle', [this.activePlayerId, 'toggle']);
  }
}
