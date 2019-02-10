import { html } from './../../utils/dom.js';

function renderPlaylist(list) {
  if (list.length === 0) {
    return html`
      <li>Empty</li>
    `;
  }
  return html`
    ${
      list.map(
        (item) =>
          html`
            <li>${item.title}</li>
          `
      )
    }
  `;
}

export default (store) => html`
  <div class="c-playlist">
    <ul>
      ${renderPlaylist(store.playlist)}
    </ul>
  </div>
`;
