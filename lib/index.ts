#!/usr/bin/env node

import { initialisationColors } from './colors/index.js';
import { initLib } from './init/index.js';
import { downloadFontsAndGenereateCSS } from './fonts/index.js';

const args = process.argv.slice(2);

if (args[0] === 'init' && args.length <= 1) {
  initLib();
} else if (args[0] === 'colors' && args.length <= 1) {
  initialisationColors();
} else if (args[0] === 'fonts' && args.length <= 1) {
  downloadFontsAndGenereateCSS();
} else if (args[0] === 'text' && args.length <= 1) {
  console.log('dsqddq');
} else {
  const url: string = 'https://style-starter-kit.vercel.app/';
  console.log('Command not found, check the documentation for help' + url);
}
