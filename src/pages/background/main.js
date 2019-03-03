import Options from './../../modules/Options.js';
import Kodi from '../../modules/Kodi.js';
import { getBrowser, getBrowserInfo } from './../../modules/utils/browser.js';

const options = new Options();

options.getFormStorage().then(async () => {
  const kodi = new Kodi(options.devices[0]);
  const browser = getBrowser();
  const browserInfo = getBrowserInfo();
  const manifest = browser.runtime.getManifest();

  kodi.api.listen('Player.OnStop', () => {
    if (!options.replayNotification) return;

    const notificationOptions = {
      type: 'basic',
      title: browser.i18n.getMessage('extensionName'),
      message: browser.i18n.getMessage('backgroundReplayNotification'),
      iconUrl: browser.extension.getURL(manifest.icons[128]),
    };

    // Buttons are only supported by Chrome.
    // Firefox apparently doesn't support `getBrowserInfo()` on background pages and returns `undefined`.
    // So `null` should be everything but Firefox. TODO Replace this hack with something better.
    if (browserInfo.name === null) {
      notificationOptions.buttons = [
        { title: browser.i18n.getMessage('backgroundReplayNotificationHide') },
        { title: browser.i18n.getMessage('backgroundReplayNotificationAction') },
      ];
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
        options.replayNotification = false;
        options.saveToStorage();
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
  });
  browser.contextMenus.onClicked.addListener((event) => {
    if (event.menuItemId === 'kodi-play') kodi.share(new URL(event.linkUrl));
    if (event.menuItemId === 'kodi-queue') kodi.queue(new URL(event.linkUrl));
  });
});
