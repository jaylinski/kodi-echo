import WebPlugin from './WebPlugin.js';

class Twitch extends WebPlugin {
  constructor() {
    super();

    this.domains = ['(.*)(.?)twitch.tv'];
  }

  async getPluginPath({ url }) {
    const typeAndId = this.getTypeAndId(url);
    return this.template(typeAndId);
  }

  template({ type, id }) {
    return `plugin://plugin.video.twitch/?mode=play&${encodeURIComponent(type)}=${encodeURIComponent(id)}`;
  }

  getTypeAndId(url) {
    const urlPathParts = url.pathname.split('/');
    const isLive = urlPathParts.length === 2;

    return {
      type: isLive ? 'channel_name' : 'video_id',
      id: isLive ? urlPathParts[1] : urlPathParts[2],
    };
  }
}

export default Twitch;
