import WebSocketApi from './WebSocketApi.js';
import { getLocal, setLocal } from './utils/storage.js';
import { getPluginByUrl } from './plugin.js';

export default class Kodi extends EventTarget {
  constructor() {
    super();

    this.api = new WebSocketApi();
    this.activePlayerId = 0;
    this.activePlaylistId = 0;

    this.listeners();
  }

  async connect(options) {
    await this.api.connect(options);
    await this.sync();
  }

  listeners() {
    // Listen for connectivity events.
    this.api.addEventListener('api.connected', (event) => {
      this.dispatchEvent(new CustomEvent('api.connected', { detail: event.detail }));
    });
    this.api.addEventListener('api.active', (event) => {
      this.dispatchEvent(new CustomEvent('api.active', { detail: event.detail }));
    });

    // Listen for events from Kodi.
    // We could immediately use the sent information to update the store, but it easier to just do another sync.
    this.api.listen('Application.OnVolumeChanged', () => this.sync());
    this.api.listen('Player.OnAVStart', () => this.sync());
    this.api.listen('Player.OnPropertyChanged', () => this.sync());
    this.api.listen('Player.OnPlay', () => this.sync());
    this.api.listen('Player.OnPause', () => this.sync());
    this.api.listen('Player.OnResume', () => this.sync());
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

    plugin.stopCurrentlyPlayingMedia();

    await this.clear();
    await this.add(file);
    await this.play();
  }

  /**
   * @param {URL} url
   * @param {Object|null} notification
   * @param {string} notification.title
   * @param {string} notification.message
   * @returns {Promise<void>}
   */
  async queue(url, notification = null) {
    const plugin = getPluginByUrl(url);
    const file = await plugin.getPluginPath({ url });

    await this.add(file);

    if (notification) await this.showNotification(notification.title, notification.message);
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

  /**
   * @param {('next'|'previous')} to
   * @return {Promise<void>}
   */
  async goTo(to) {
    await this.api.send('Player.GoTo', [this.activePlayerId, to]);
  }

  /**
   * @param {number} percentage
   * @return {Promise<void>}
   */
  async seek(percentage) {
    await this.api.send('Player.Seek', [this.activePlayerId, { percentage }]);
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

  /**
   * @param {boolean|'toggle'} mute
   * @return {Promise<void>}
   */
  async setMute(mute) {
    await this.api.send('Application.SetMute', { mute });
  }

  async setRepeat() {
    await this.api.send('Player.SetRepeat', [this.activePlayerId, 'cycle']);
  }

  async setShuffle() {
    await this.api.send('Player.SetShuffle', [this.activePlayerId, 'toggle']);
  }

  /**
   * @param {string} title
   * @param {string} message
   * @return {Promise<void>}
   */
  async showNotification(title, message) {
    await this.api.send('GUI.ShowNotification', { title, message });
  }
}
