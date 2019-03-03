import WebPlugin from './WebPlugin.js';
import { executeScriptInActiveTab } from './../utils/tabs.js';

class Soundcloud extends WebPlugin {
  constructor() {
    super();

    this.domains = ['(.*)(.?)soundcloud.com'];
  }

  async getPluginPath() {
    const audioId = await this.getAudioId();
    return this.template(audioId);
  }

  template(audioId) {
    return `plugin://plugin.audio.soundcloud/play/?audio_id=${audioId}`;
  }

  async getAudioId() {
    const result = await executeScriptInActiveTab(
      `document.querySelector('meta[property="al:ios:url"]').getAttribute('content');`
    );

    return result[0].substr(result[0].lastIndexOf(':') + 1);
  }
}

export default Soundcloud;
