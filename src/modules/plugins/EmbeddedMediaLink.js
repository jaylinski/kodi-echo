import WebPlugin from './WebPlugin.js';
import { executeScriptInActiveTab } from './../utils/tabs.js';

/**
 * TODO Integrate this as part of a UI change?
 * Maybe we can auto-detect all mp3s and other streams and then
 * add them to a new tab in the extension pop-up. Or we could
 * add found links to the "Play"-button drop-down menu.
 * Adding this as a part of the normal plugins-logic makes
 * existing things way too complicated. (I tried it...)
 */
class EmbeddedMediaLink extends WebPlugin {
  constructor() {
    super();

    this.domains = ['.*'];
  }

  async getPluginPath({ url }) {
    const links = await this.searchMediaLinks();
    console.debug(links);
    return links;
  }

  async searchMediaLinks() {
    return await executeScriptInActiveTab(
      `try { document.querySelector('a[href$=".mp3"]').getAttribute('href'); } catch (e) {}`
    );
  }
}

export default EmbeddedMediaLink;
