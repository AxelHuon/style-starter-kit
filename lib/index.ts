#!/usr/bin/env node

import { initialisationColors } from "./colors/index.js";
import { initLib } from "./init/index.js";
import {loadConfig} from "./utils/configFile.js";



const args = process.argv.slice(2);


const configFunction = async () =>{
  const configFile = await loadConfig()
  console.log(configFile)
}

if (args[0] === "init" && args.length<=1) {
  initLib()
}else if (args[0] === "colors" && args.length<=1){
  initialisationColors();
}else{
  console.log("command not found");
}
