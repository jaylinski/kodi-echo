import { getBrowser } from './../../utils/browser.js';
import { html } from './../../utils/dom.js';

const browser = getBrowser();

export default (store, i18n) => {
  const reload = () => browser.runtime.reload();

  return html`
    <div class="c-options c-section__content">
      <table cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <th>
              <label for="replay_notification">${i18n.getMessage('optionsReplayNotifications')}</label>
            </th>
            <td>
              <!-- TODO Use a more visually appealing on-off switch. (https://material.angular.io/components/slide-toggle/overview) -->
              <input
                @change="${store.actions.updateOptions}"
                type="checkbox"
                id="replay_notification"
                data-option="replayNotification"
                role="switch"
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
