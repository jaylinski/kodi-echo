import WebPlugin from './WebPlugin.js';
import { executeScriptInActiveTab } from './../utils/tabs.js';

class Youtube extends WebPlugin {
  constructor() {
    super();

    this.domains = ['(.*)(.?)youtube.com'];
  }

  async getPluginPath({ url }) {
    return this.template(this.getVideoId(url));
  }

  async stopCurrentlyPlayingMedia() {
    await executeScriptInActiveTab(
      `try { document.querySelector('#player-container .playing-mode video').click() } catch (e) {}`
    );
  }

  template(videoId) {
    return `plugin://plugin.video.youtube/play/?video_id=${videoId}`;
  }

  getVideoId(url) {
    return url.searchParams.get('v');
  }
}

export default Youtube;
