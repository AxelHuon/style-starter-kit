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
import inquirer from 'inquirer';
import { installLibrary } from '../utils/libInstall.js';
import { writeConfigFile } from '../utils/configFile.js';
const detectFramework = () => {
    // Vérifier pour Next.js
    if ((fs.existsSync(path.join(process.cwd(), 'pages')) &&
        fs.existsSync(path.join(process.cwd(), 'next.config.js'))) ||
        fs.existsSync(path.join(process.cwd(), 'next.config.ts'))) {
        return 'nextjs';
    }
    // Vérifier pour React (peut être amélioré en vérifiant les dépendances dans package.json)
    if (fs.existsSync(path.join(process.cwd(), 'src', 'index.js')) ||
        fs.existsSync(path.join(process.cwd(), 'src', 'App.js')) ||
        fs.existsSync(path.join(process.cwd(), 'src', 'index.tsx')) ||
        fs.existsSync(path.join(process.cwd(), 'src', 'App.tsx'))) {
        return 'react';
    }
    // Vérifier pour Vue
    if (fs.existsSync(path.join(process.cwd(), 'vue.config.js')) ||
        fs.existsSync(path.join(process.cwd(), 'vue.config.ts'))) {
        return 'vue';
    }
    // Vérifier pour Nuxt.js
    if (fs.existsSync(path.join(process.cwd(), 'nuxt.config.js')) ||
        fs.existsSync(path.join(process.cwd(), 'nuxt.config.ts'))) {
        return 'nuxt';
    }
    return 'unknown';
};
function askTypeScriptOrJavaScript() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'languageChoice',
            message: 'Voulez-vous utiliser TypeScript ou JavaScript?',
            choices: ['TypeScript', 'JavaScript'],
        },
    ]);
}
function askLibStyle() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'libStyleChoice',
            message: 'Voulez-vous utiliser styled-components ou css-modules?',
            choices: ['styled-components', 'css-modules'],
        },
    ]);
}
export const initLib = () => __awaiter(void 0, void 0, void 0, function* () {
    const frameworkValue = detectFramework();
    writeConfigFile('framework', frameworkValue);
    const language = yield askTypeScriptOrJavaScript();
    writeConfigFile('language', language.languageChoice);
    const styleLib = yield askLibStyle();
    writeConfigFile('styleLib', styleLib.libStyleChoice);
    if (styleLib.libStyleChoice === 'styled-components') {
        installLibrary('styled-components');
    }
    return true;
});
