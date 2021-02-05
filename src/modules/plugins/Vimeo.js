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
    const path = url.pathname;
    const routes = [/^\/(?<id>\d+)$/, /^\/(?<id>\d+)\/(?<hash>\w+)$/, /\/(?<id>\d+)$/];
    const route = routes.find((pattern) => path.match(pattern) !== null);

    if (route === undefined) {
      throw new Error('No Vimeo video ID found in URL.');
    }

    const groups = path.match(route).groups;

    return `${groups.id}${groups.hash ? ':' + groups.hash : ''}`;
  }
}

export default Vimeo;
