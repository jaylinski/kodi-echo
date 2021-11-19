import { test, expect } from '@jest/globals';
import Vimeo from './Vimeo.js';

test('Generates a plugin path from a standard URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/1234567');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});

test('Generates a plugin path from a channel URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/channels/staffpicks/1234567');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});

test('Generates a plugin path from a group URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/groups/motion/videos/1234567');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});

test('Generates a plugin path from a showcase URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/showcase/123/video/1234567');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});

test('Generates a plugin path from an event URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/event/123/videos/1234567');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});

test('Generates a plugin path from an unlisted video URL', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/12345/hash');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=12345:hash');
});

test('Generates a plugin path from a URL with tracking params', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/1234567?foo=bar&utm=vimeo');
  const pluginPath = await vimeo.getPluginPath({ url });

  expect(pluginPath).toBe('plugin://plugin.video.vimeo/play/?video_id=1234567');
});

test('Throws an error if no video ID can be found', async () => {
  const vimeo = new Vimeo();
  const url = new URL('https://vimeo.com/channel');

  await expect(vimeo.getPluginPath({ url })).rejects.toThrow();
});
