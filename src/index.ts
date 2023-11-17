#!/usr/bin/env node

import { initialisationColors } from "./colors/index.js";
import { initLib } from "./init/index.js";

const args = process.argv.slice(2);

if (args[0] === "init") {
  initLib()
}else if (args[0] === "init-colors"){
  initialisationColors();
}


