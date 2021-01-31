import { test } from '@jest/globals';
import Vimeo from './Vimeo.js';

test('Generates a plugin path from a standard URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/1234567');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});

test('Generates a plugin path from a channel URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/channels/staffpicks/388640017');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=388640017');
});

test('Generates a plugin path from an unlisted video URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/12345/6789');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=12345:6789');
});

test('Generates a plugin path from a URL with tracking params', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/1234567?foo=bar&utm=vimeo');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});
