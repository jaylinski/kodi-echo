import fs from 'fs';
import { glob } from 'node:fs/promises';
import path from 'path';
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

fs.mkdirSync('./build', { recursive: true });

// Copy files.
console.log('Copying source files ...');
const files = glob('./src/**/*.*', { exclude: ['./src/modules/npm/**/*', './src/**/*.test.js'] });
for await (const filePath of files) {
  const dest = filePath.replace('src/', 'build/');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.createReadStream(filePath).pipe(fs.createWriteStream(dest));
}

// Copy dependencies.
console.log('Copying node modules ...');
for await (const module of node_modules) {
  const files = glob(`./node_modules/${module}/**/*.js`);
  for await (const filePath of files) {
    const dest = filePath.replace('node_modules/', 'build/modules/npm/');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.createReadStream(filePath).pipe(fs.createWriteStream(dest));
  }
}

// Resize images & copy.
images.map(function (image) {
  console.log('Resizing image ' + image.src + ' to size ' + image.size);
  fs.mkdirSync(path.dirname(image.dst), { recursive: true });
  fs.createReadStream(image.src).pipe(sharp().resize(image.size)).pipe(fs.createWriteStream(image.dst));
});

console.log('Build finished!');
