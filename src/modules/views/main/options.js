import { getBrowser } from './../../utils/browser.js';
import { html } from './../../utils/dom.js';

const browser = getBrowser();

export default (store, i18n) => {
  const reload = () => browser.runtime.reload();

  return html`
    <div class="c-options c-section__content">
      <!-- TODO Use more visually appealing on-off switches:
         https://material.angular.io/components/slide-toggle/overview -->
      <table cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <th>
              <label for="detect_embedded_media">${i18n.getMessage('optionsAutoDetectEmbeddedMediaLinks')}</label>
              <small>${i18n.getMessage('optionsExperimental')}</small>
            </th>
            <td>
              <input
                @change="${store.actions.updateOptions}"
                type="checkbox"
                id="detect_embedded_media"
                data-option="autoDetectEmbeddedMediaLinks"
                role="switch"
                .checked=${store.options.autoDetectEmbeddedMediaLinks}
                ?checked=${store.options.autoDetectEmbeddedMediaLinks}
                aria-checked="${store.options.autoDetectEmbeddedMediaLinks ? 'true' : 'false'}"
              />
            </td>
          </tr>
          <tr>
            <th>
              <label for="replay_notification">${i18n.getMessage('optionsReplayNotifications')}</label>
              <small>${i18n.getMessage('optionsExperimental')}</small>
            </th>
            <td>
              <input
                @change="${store.actions.updateOptions}"
                type="checkbox"
                id="replay_notification"
                data-option="replayNotification"
                role="switch"
                .checked=${store.options.replayNotification}
                ?checked=${store.options.replayNotification}
                aria-checked="${store.options.replayNotification ? 'true' : 'false'}"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <p class="c-options__notice">${i18n.getMessage('optionsReloadInfo')}</p>
      <button @click="${reload}" class="c-options__button">${i18n.getMessage('optionsReloadButton')}</button>
    </div>
  `;
};
