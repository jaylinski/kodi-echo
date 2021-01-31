import WebPlugin from './WebPlugin.js';

class Vimeo extends WebPlugin {
  constructor() {
    super();

    this.domains = ['(.*)(.?)vimeo.com'];
  }

  async getPluginPath({ url }) {
    return this.template(this.getVideoId(url));
  }

  template(videoId) {
    return `plugin://plugin.video.vimeo/play/?video_id=${videoId}`;
  }

  getVideoId(url) {
    return url.pathname
      .replace(/^\/+/, '')
      .split('/')
      .filter((n) => Number.parseInt(n, 10))
      .join(':');
  }
}

export default Vimeo;
