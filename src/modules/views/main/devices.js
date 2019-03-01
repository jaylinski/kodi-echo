import { html } from './../../utils/dom.js';

export default (store, i18n) => {
  const device = store.options.devices[0];
  const actions = {
    save: async (event) => {
      event.preventDefault();

      // The passed object has to match the `devices` object inside the `Options` class.
      await store.actions.updateDevice({
        name: event.target.option_device.value,
        ip: event.target.option_ip.value,
        port: event.target.option_port.value,
        user: event.target.option_user.value,
        password: event.target.option_password.value,
      });

      // Reestablish the websocket connection by reloading the popup.
      location.reload();
    },
  };

  return html`
    <div class="c-devices c-section__content">
      <form @submit="${actions.save}" class="c-form">
        <div class="c-form__group">
          <label for="option_device">${i18n.getMessage('optionsDeviceName')}</label>
          <input type="text" id="option_device" value="${device.name}" placeholder="Kodi" />
        </div>
        <div class="c-form__group c-form__group--flex">
          <div>
            <label for="option_ip">Host/IP</label>
            <input type="text" id="option_ip" value="${device.ip}" placeholder="192.168.0.99" />
          </div>
          <div>
            <label for="option_port">Port</label>
            <input type="number" id="option_port" value="${device.port}" placeholder="9090" />
          </div>
        </div>
        <div class="c-form__group">
          <label for="option_user" data-i18n="optionsUser">${i18n.getMessage('optionsUser')}</label>
          <input type="text" id="option_user" value="${device.user}" placeholder="${i18n.getMessage('optionsUser')}" />
        </div>
        <div class="c-form__group">
          <label for="option_password" data-i18n="optionsPassword">${i18n.getMessage('optionsPassword')}</label>
          <input
            type="password"
            id="option_password"
            value="${device.password}"
            placeholder="${i18n.getMessage('optionsPassword')}"
          />
        </div>
        <div class="c-form__group">
          <button class="c-form__button" type="submit">${i18n.getMessage('optionsSave')}</button>
        </div>
      </form>
    </div>
  `;
};
