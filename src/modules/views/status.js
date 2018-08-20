function noConnection(options) {
  return `
    <div class="c-info--status c-info--status__error">
      <p>Could not establish connection with Kodi:</p><br>
      <p>${options.ip}:${options.port}</p>
    </div>`;
}

function apiError(error) {
  return `
    <div class="c-info--status c-info--status__error">
      <p>Error while sending data to Kodi:</p><br>
      <p>${error}</p>
    </div>`;
}

export default (store) => `
<div class="c-loader ${store.apiActive ? 'c-loader__show' : ''}"></div>
<div class="c-info">
  ${!store.apiConnected ? noConnection(store.options) : ''}
  ${store.apiError ? apiError(store.apiError.message) : ''}
</div>`;
