#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initialisationColors } from "./colors/index.js";
import { initLib } from "./init/index.js";
import { loadConfig } from "./utils/configFile.js";
const args = process.argv.slice(2);
const configFunction = () => __awaiter(void 0, void 0, void 0, function* () {
    const configFile = yield loadConfig();
    console.log(configFile);
});
if (args[0] === "init" && args.length <= 1) {
    initLib();
}
else if (args[0] === "colors" && args.length <= 1) {
    initialisationColors();
}
else {
    console.log("command not found");
}
