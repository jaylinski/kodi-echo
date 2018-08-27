![Kodi logo](https://github.com/xbmc/xbmc/raw/master/addons/webinterface.default/icon-128.png)

# [Kodi](https://github.com/xbmc/xbmc) Echo &horbar; Browser Extension

Kodi Echo lets you share your favorite content with Kodi (XBMC).

Should work with all [WebExtension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) compatible browsers 
including Mozilla Firefox, Google Chrome and Microsoft Edge.

> **This extension requires a script module compatible browser!**   
> See this chart for current browser support: [https://caniuse.com/#feat=es6-module](https://caniuse.com/#feat=es6-module)

If you want to try a more complete and robust extension, 
consider installing the [Play to Kodi](https://github.com/khloke/play-to-xbmc-chrome) Chrome extension.
Check out the [comparison between Kodi Echo and Play to Kodi](#comparison-with-play-to-kodi) for more details.

## Features

* Lets you easily share content from websites with Kodi.
* Uses as few permissions as possible & respects your privacy.
* Does not break websites by avoiding to inject scripts.
* Lets you replay shared content.

<!-- TODO Add screenshots (popup, context menu) -->

## Installation

* Mozilla Firefox
* Google Chrome

<!-- TODO Test in in Microsoft Edge -->

### Enabling & Configuring

Visit Kodi &rarr; Settings &rarr; Services &rarr; Control.

* Enable "Allow control of Kodi via HTTP"
* Enable "Allow programs on this system to control Kodi"
* Enable "Allow programs on other systems to control Kodi"

> For security reasons you should set a username and password to prevent unauthorized access!

## Permissions

This extension requires the permission

* to **access your active browser tab**   
  This allows the extension to extract information from your current URL, like the Youtbe video ID.
* to **store data** in your browser   
  This allows the extension to save your settings, like your Kodi IP and Kodi credentials.
* to **send you notifications**   
  This allows the extension to show you a "Replay" dialog if a media item finished playing.
* to **execute a script in the background**   
  This allows the extension to keep connected to Kodi and to send you notifications if the player stops.

For more information on permissions, visit [developer.mozilla.org](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/permissions#activeTab_permission).

## Privacy

This extension does not collect any kind of data and will never do.

It only sends requests to your configured Kodi host.

## Sharing content to Kodi

#### Supported websites

| Website            | Kodi Plugin                                                        |
| ------------------ | ------------------------------------------------------------------ |
| www.youtube.com    | [plugin.video.youtube](http://kodi.wiki/view/Add-on:YouTube)       |
| www.soundcloud.com | [plugin.audio.soundcloud](http://kodi.wiki/view/Add-on:SoundCloud) |
| www.mixcloud.com   | [plugin.audio.mixcloud](http://kodi.wiki/view/Add-on:MixCloud)     |

#### Comparison with Play to Kodi

|                        | Kodi Echo  | Play to Kodi |
| ---------------------- | ---------- | ------------ |
| Avoids content scripts | ☑          | ❎            |
| Adds a context menu    | ☑          | ☑            |
| Instant replay         | ☑          | ❎            |
| Number of plugins      | 3          | \> 30        |
| Languages (i18n)       | 2          | 1            |
| Communication          | WebSockets | HTTP         |
| Uses standard WebExtensions API | ☑ | ❎            |

## Development

### Build

Run `npm run build`.

### Dependencies

* `glob` &rarr; File selection
* `onchange` &rarr; Watch mode
* `prettier` &rarr; Code formatting
* `sharp` &rarr; Image editing
* `web-ext` &rarr; Firefox extension building

### Roadmap

* Add more controls (Queue button)
* Localize UI
* Resolve all TODOs
* Test critical code
* Get approval from XBMC Foundation for use of logo and name
* Publish as Firefox Add-on, Chrome Extension and Microsoft Edge Extension

## Attributions

The design of this extension is strongly influenced by the 
awesome Kodi Web Interface [Chorus2](https://github.com/xbmc/chorus2).

## Copyright and license

Kodi Echo is licensed under the MIT License - see the `LICENSE` file for details.
