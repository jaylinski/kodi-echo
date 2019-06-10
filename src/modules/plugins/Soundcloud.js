import WebPlugin from './WebPlugin.js';

class Soundcloud extends WebPlugin {
  constructor() {
    super();

    this.domains = ['(.*)(.?)soundcloud.com'];
  }

  async getPluginPath({ url }) {
    return this.template(url);
  }

  template(url) {
    return `plugin://plugin.audio.soundcloud/play/?url=${encodeURIComponent(url)}`;
  }
}

export default Soundcloud;
