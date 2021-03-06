import fs from 'fs';
import path from 'path';
import glob from 'glob';
import sharp from 'sharp';

// #######################
// ### Configuration
// #######################

const node_modules = ['lit-html'];
const images = [
  {
    src: './src/assets/logo.png',
    dst: './build/assets/icon-48.png',
    size: 48,
  },
  {
    src: './src/assets/logo.png',
    dst: './build/assets/icon-96.png',
    size: 96,
  },
  {
    src: './src/assets/logo.png',
    dst: './build/assets/icon-128.png',
    size: 128,
  },
  {
    src: './src/assets/logo.png',
    dst: './build/assets/icon-256.png',
    size: 256,
  },
];

// #######################
// ### Build
// #######################

console.log('Building ...');

fs.mkdirSync('./build');

// Copy files.
console.log('Copying source files ...');
glob('./src/**/*.*', { ignore: ['./src/modules/npm/**/*', './src/**/*.test.js'] }, (error, files) => {
  files.map((src) => {
    const dest = src.replace('/src/', '/build/');
    mkdirSyncP(path.dirname(dest));
    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
  });
});

// Copy dependencies.
console.log('Copying node modules ...');
node_modules.map((module) => {
  glob(`./node_modules/${module}/**/*.js`, {}, (error, files) => {
    files.map((src) => {
      const dest = src.replace('/node_modules/', '/build/modules/npm/');
      mkdirSyncP(path.dirname(dest));
      fs.createReadStream(src).pipe(fs.createWriteStream(dest));
    });
  });
});

// Resize images & copy.
images.map(function (image) {
  console.log('Resizing image ' + image.src + ' to size ' + image.size);
  mkdirSyncP(path.dirname(image.dst));
  fs.createReadStream(image.src).pipe(sharp().resize(image.size)).pipe(fs.createWriteStream(image.dst));
});

console.log('Build finished!');

// #######################
// ### Utils
// #######################

/**
 * Make directory (sync) with parent dirs.
 *
 * @param {string} dir
 */
function mkdirSyncP(dir) {
  const sep = path.sep;
  const initDir = path.isAbsolute(dir) ? sep : '';
  dir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(parentDir, childDir);
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir);
    }
    return curDir;
  }, initDir);
}
