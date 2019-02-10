import Options from './../../modules/Options.js';
import Store from './../../modules/Store.js';
import View from './../../modules/View.js';

const options = new Options();

options.getFormStorage().then(() => {
  new View({
    root: document.getElementById('app'),
    store: new Store({ options }),
  });
});
