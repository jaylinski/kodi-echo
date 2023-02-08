import Mixcloud from './plugins/Mixcloud.js';
import Soundcloud from './plugins/Soundcloud.js';
import Twitch from './plugins/Twitch.js';
import Vimeo from './plugins/Vimeo.js';
import Youtube from './plugins/Youtube.js';

const plugins = [new Mixcloud(), new Soundcloud(), new Twitch(), new Vimeo(), new Youtube()];

/**
 * Get the plugin by the URL.
 *
 * @typedef {import('./plugins/WebPlugin.js')} WebPlugin
 * @param {object} url
 * @return {WebPlugin}
 */
function getPluginByUrl(url) {
  const plugin = plugins.find((plugin) => plugin.ownsUrl(url.hostname));

  if (!plugin) {
    throw new Error(`No plugin found for "${url.hostname}".`);
  }

  return plugin;
}

export { getPluginByUrl };
