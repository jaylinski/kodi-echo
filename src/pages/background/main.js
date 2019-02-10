import Options from './../../modules/Options.js';
import Kodi from '../../modules/Kodi.js';
import { getBrowser, getBrowserInfo } from './../../modules/utils/browser.js';

const options = new Options();

options.getFormStorage().then(async () => {
  const kodi = new Kodi(options);
  const browser = getBrowser();
  const browserInfo = getBrowserInfo();
  const manifest = browser.runtime.getManifest();

  console.debug(browserInfo.name);

  kodi.api.listen('Player.OnStop', () => {
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
  // TODO Change to standard `browser.menus.(create|onClicked)` as soon as supported by browsers!
  browser.contextMenus.create({
    id: 'kodi',
    title: browser.i18n.getMessage('extensionName'),
    contexts: ['link'],
  });
  browser.contextMenus.create({
    id: 'kodi-play',
    parentId: 'kodi',
    title: browser.i18n.getMessage('menuPlay'),
    contexts: ['link'],
  });
  browser.contextMenus.create({
    id: 'kodi-queue',
    parentId: 'kodi',
    title: browser.i18n.getMessage('menuQueue'),
    contexts: ['link'],
    enabled: false, // TODO Implement.
  });
  browser.contextMenus.onClicked.addListener((event) => {
    if (event.menuItemId === 'kodi-play') kodi.share(new URL(event.linkUrl));
  });
});
