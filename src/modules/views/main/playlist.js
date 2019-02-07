function renderPlaylist(list) {
  if (list.length === 0) {
    return `<li>Empty</li>`;
  }
  return list.map((item) => `<li>${item.title}</li>`).join('');
}

export default (store) => `
<div class="c-playlist">
  <ul>${renderPlaylist(store.playlist)}</ul>
</div>`;
