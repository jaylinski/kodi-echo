import Kodi from './../../modules/Kodi.js';
import Options from './../../modules/Options.js';
import Store from './../../modules/Store.js';
import View from './../../modules/View.js';

const options = new Options();

options.getFormStorage().then(() => {
  const store = new Store({ options });
  const app = new View({
    root: document.getElementById('app'),
    store,
  });

  new Kodi(app, options);
});
