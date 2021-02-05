import { test, expect } from '@jest/globals';
import { getPluginByUrl } from './plugin.js';
import Vimeo from './plugins/Vimeo.js';

test('Gets a plugin by URL', () => {
  const plugin = getPluginByUrl(new URL('https://vimeo.com'));

  expect(plugin).toBeInstanceOf(Vimeo);
});

test('Throws if no plugin can be found', () => {
  const getPlugin = () => getPluginByUrl(new URL('https://domain.tld'));

  expect(getPlugin).toThrow();
});
