export default (i18n, manifest) => `
<div class="c-footer">
  <div class="c-footer__name">
    <a href="https://www.github.com/jaylinski/kodi-echo" target="_blank">Kodi Echo</a>
    <span>&nbsp;&bull;&nbsp;</span>
    <a href="#" id="open-options" target="_blank">${i18n.getMessage('footerOptions')}</a>
    <span>&nbsp;&bull;&nbsp;</span>
    <a href="">${i18n.getMessage('footerHelp')}</a>
  </div>
  <div class="c-footer__version">
    <span>v${manifest.version}</span>
  </div>
</div>`;
