import Mixcloud from './plugins/Mixcloud.js';
import Soundcloud from './plugins/Soundcloud.js';
import Twitch from './plugins/Twitch.js';
import Vimeo from './plugins/Vimeo.js';
import Youtube from './plugins/Youtube.js';

const plugins = [new Mixcloud(), new Soundcloud(), new Twitch(), new Vimeo(), new Youtube()];

function PluginException(message) {
  this.message = message;
  this.name = 'PluginException';
}

/**
 * Get the plugin by the URL.
 *
 * @param {object} url
 */
function getPluginByUrl(url) {
  const plugin = plugins.find((plugin) => plugin.ownsUrl(url.hostname));

  if (!plugin) {
    throw new PluginException(`No plugin found for "${url.hostname}".`);
  }

  return plugin;
}

export { getPluginByUrl };
