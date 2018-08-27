import controls from './main/controls.js';
import playlist from './main/playlist.js';

function showRoute(store, route) {
  return store.route === route ? 'style="display:block"' : '';
}

export default (store) => `
<div class="c-body">
  <nav class="c-body--sidebar"> 
    <a href="#" data-route="controls">🎛</a>
    <a href="#" data-route="playlist">🗒</a>
  </nav>
  <main class="c-body--main"> 
    <section class="c-body--section c-body--section-controls" ${showRoute(store, 'controls')}> 
      ${controls(store)}
    </section>
    <section class="c-body--section c-body--section-playlist" ${showRoute(store, 'playlist')}>
      ${playlist(store)}
    </section>
  </main>
</div>`;
