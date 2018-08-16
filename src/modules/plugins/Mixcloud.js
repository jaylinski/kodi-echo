import WebPlugin from './WebPlugin.js';

const MODE_PLAY = 40;

class Mixcloud extends WebPlugin {
  constructor() {
    super();

    this.domains = ['(.*)(.?)mixcloud.com'];
  }

  async getPluginPath({ url }) {
    const audioId = this.getAudioId(url);
    return this.template(audioId);
  }

  template(audioId) {
    return `plugin://plugin.audio.mixcloud/play/?mode=${MODE_PLAY}&key=${encodeURIComponent(audioId)}`;
  }

  getAudioId(url) {
    return url.href.match('(https|http)://(www.)?mixcloud.com(/[^_&#?]+/[^_&#?]+)')[3];
  }
}

export default Mixcloud;
