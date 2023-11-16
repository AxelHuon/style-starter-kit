#!/usr/bin/env node

import { initialisationColors } from "./colors/index.js";

const args = process.argv.slice(2);

if (args[0] === "colors") {
  initialisationColors();
}
