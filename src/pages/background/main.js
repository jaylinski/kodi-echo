import Options from './../../modules/Options.js';
import Kodi from '../../modules/Kodi.js';
import { getBrowser, getBrowserInfo } from './../../modules/utils/browser.js';

const RECONNECT_TIMEOUT = 10000; // milliseconds
const browser = getBrowser();
const manifest = browser.runtime.getManifest();

class Background {
  constructor() {
    this.kodi = new Kodi();
    this.options = new Options();
    this.browserInfo = {};

    // Event handlers are registered in an object to keep the reference to the functions.
    // This is needed for removing event handlers registered with these functions.
    this.eventHandlers = {
      kodiPlayerOnStop: (event) => {
        const playerIsEnd = (((event.detail || {}).params || {}).data || {}).end;
        if (this.options.replayNotification && playerIsEnd) {
          browser.notifications.onClicked.removeListener(this.eventHandlers.notificationsOnClicked);
          browser.notifications.onButtonClicked.removeListener(this.eventHandlers.notificationsOnClicked);
          browser.notifications.onClicked.addListener(this.eventHandlers.notificationsOnClicked);
          browser.notifications.onButtonClicked.addListener(this.eventHandlers.notificationsOnButtonClicked);
          browser.notifications.create('replay', this.getReplayNotificationOptions());
        }
      },
      menusOnClicked: (event) => {
        if (event.menuItemId === 'kodi-play') this.kodi.share(new URL(event.linkUrl));
        if (event.menuItemId === 'kodi-queue') this.kodi.queue(new URL(event.linkUrl));
      },
      notificationsOnClicked: () => {
        // Firefox fallback (since it doesn't support buttons).
        if (this.browserInfo.name !== null) {
          this.kodi.replay();
        }
        browser.notifications.clear('replay');
      },
      notificationsOnButtonClicked: (id, index) => {
        if (index === 0) {
          this.options.replayNotification = false;
          this.options.saveToStorage();
        }
        if (index === 1) this.kodi.replay();
        browser.notifications.clear('replay');
      },
    };

    this.addListeners();
  }

  addListeners() {
    browser.contextMenus.onClicked.addListener(this.eventHandlers.menusOnClicked);
    this.kodi.api.addEventListener('Player.OnStop', this.eventHandlers.kodiPlayerOnStop);
  }

  async listen() {
    await this.options.getFormStorage();
    this.browserInfo = await getBrowserInfo();

    try {
      await this.kodi.connect(this.options.devices[0]);
      // TODO Listen for `api.connected: false` events and also add a setTimeout function.
    } catch (e) {
      console.error('Failed to connect to Kodi: ', e);
      console.info('Trying to reconnect in 10 seconds...');
      window.setTimeout(this.listen.bind(this), RECONNECT_TIMEOUT);
    }
  }

  getReplayNotificationOptions() {
    const replayNotificationOptions = {
      type: 'basic',
      title: browser.i18n.getMessage('extensionName'),
      message: browser.i18n.getMessage('backgroundReplayNotification'),
      iconUrl: browser.extension.getURL(manifest.icons[128]),
    };

    // Buttons are currently not supported in Firefox.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications/onButtonClicked
    if (this.browserInfo.name !== 'Firefox') {
      replayNotificationOptions.buttons = [
        { title: browser.i18n.getMessage('backgroundReplayNotificationHide') },
        { title: browser.i18n.getMessage('backgroundReplayNotificationAction') },
      ];
    }

    return replayNotificationOptions;
  }
}

const background = new Background();
background.listen();

browser.runtime.onInstalled.addListener(() => {
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
});

browser.runtime.onMessage.addListener((request) => {
  if (request.message === 'optionsChanged') background.listen();
});
