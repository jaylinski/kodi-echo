import { html } from './../../utils/dom.js';

function toggleButton(id, on) {
  // TODO Use a more visually appealing on-off switch. (https://material.angular.io/components/slide-toggle/overview)
  return html`
    <input type="checkbox" id="${id}" role="switch" aria-checked="${on ? 'true' : 'false'}" />
  `;
}

export default (store, i18n) => {
  return html`
    <div class="c-options c-section__content">
      <table>
        <tbody>
          <tr>
            <th><label for="replay_notification">${i18n.getMessage('optionsReplayNotifications')}</label></th>
            <td>${toggleButton('replay_notification', store.options.replayNotifications)}</td>
          </tr>
          <!-- TODO Implement.
          <tr>
            <th>Key bindings</th>
            <td>toggle button</td>
          </tr>
          <tr>
            <th>Youtube API</th>
            <td>toggle button</td>
          </tr>
          -->
        </tbody>
      </table>
    </div>
  `;
};
