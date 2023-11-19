var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import * as process from "process";
import { initLib } from "../init/index.js";
import { initialisationColors } from "../colors/index.js";
export const writeConfigFile = (key, value) => {
    const configPath = path.join(process.cwd(), './', 'style-starter-kit.config.js');
    if (fs.existsSync(configPath)) {
        let configContent = fs.readFileSync(configPath, { encoding: 'utf8' });
        const regex = new RegExp(`${key}: '.*'`, 'g');
        if (regex.test(configContent)) {
            configContent = configContent.replace(regex, `${key}: '${value}'`);
        }
        else {
            configContent = configContent.replace(/};\s*$/, `  ${key}: '${value}',\n};\n`);
        }
        fs.writeFileSync(configPath, configContent, { encoding: 'utf8' });
    }
    else {
        const initialConfigContent = `export default {\n  ${key}: '${value}',\n};\n`;
        fs.writeFileSync(configPath, initialConfigContent, { encoding: 'utf8' });
        console.log("Le fichier de configuration a été créé.");
    }
};
export function loadConfig(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const configPath = path.join(process.cwd(), 'style-starter-kit.config.js');
        try {
            const module = yield import(configPath);
            return module.default;
        }
        catch (error) {
            const responseInitLib = yield initLib();
            if (responseInitLib) {
                if (command === "colors") {
                    initialisationColors();
                }
            }
            return 404;
        }
    });
}
