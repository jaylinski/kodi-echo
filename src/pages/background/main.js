import Kodi from './../../modules/Kodi.js';
import Options from './../../modules/Options.js';
import WebSocketApi from './../../modules/WebSocketApi.js';
import { getBrowser, getBrowserInfo } from './../../utils/browser.js';

const options = new Options();

options.getFormStorage().then(async () => {
  const api = new WebSocketApi(options);
  const kodi = new Kodi('background', options); // TODO Avoid this weird `background` param.
  const browser = getBrowser();
  const browserInfo = getBrowserInfo();
  const manifest = browser.runtime.getManifest();

  await api.connect();

  console.debug(browserInfo.name);

  api.listen('Player.OnStop', () => {
    const notificationOptions = {
      type: 'basic',
      title: browser.i18n.getMessage('extensionName'),
      message: 'Do you want to replay?',
      iconUrl: browser.extension.getURL(manifest.icons[128]),
    };

    // Buttons are only supported by Chrome.
    // Firefox apparently doesn't support `getBrowserInfo()` on background pages and returns `undefined`.
    // So `null` should be everything but Firefox. TODO Replace this hack.
    if (browserInfo.name === null) {
      notificationOptions.buttons = [{ title: `Don't show again` }, { title: '► Replay now' }];
    }

    browser.notifications.create('replay', notificationOptions);
    browser.notifications.onClicked.addListener(() => {
      // Firefox fallback (since it doesn't support buttons).
      if (browserInfo.name !== null) {
        kodi.replay();
      }
      browser.notifications.clear('replay');
    });
    browser.notifications.onButtonClicked.addListener((id, index) => {
      if (index === 0) {
        // TODO Implement "Don't show again".
      }
      if (index === 1) kodi.replay();
      browser.notifications.clear('replay');
    });
  });

  // TODO Restrict to `targetUrlPatterns` according to available plugins?
  // TODO Change to standard `browser.menus.(create|onClicked)` as soon as possible!
  browser.contextMenus.create({
    id: 'kodi',
    title: browser.i18n.getMessage('extensionName'),
    contexts: ['link'],
  });
  browser.contextMenus.create({
    id: 'kodi-play',
    parentId: 'kodi',
    title: '► Play',
    contexts: ['link'],
  });
  browser.contextMenus.create({
    id: 'kodi-queue',
    parentId: 'kodi',
    title: 'Queue',
    contexts: ['link'],
    enabled: false, // TODO Implement.
  });
  browser.contextMenus.onClicked.addListener((event) => {
    if (event.menuItemId === 'kodi-play') kodi.share(new URL(event.linkUrl));
  });
});
