var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Importation des modules nécessaires
import fetch from 'node-fetch';
import { writeFile, readFile } from 'fs/promises';
import { createDirectoryIfNeeded } from '../utils/folder.js';
import path from 'path';
import process from 'process';
import inquirer from 'inquirer';
import { loadConfig } from '../utils/configFile.js';
const fileUrlTsxFile = 'https://raw.githubusercontent.com/AxelHuon/style-starter-kit/feat/text-component/templates/components/TextComponents/TextComponents.tsx';
const fileUrlStyle = 'https://raw.githubusercontent.com/AxelHuon/style-starter-kit/feat/text-component/templates/components/TextComponents/TextComponent.style.ts';
const fileUrlType = 'https://raw.githubusercontent.com/AxelHuon/style-starter-kit/feat/text-component/templates/components/TextComponents/TextComponent.type.ts';
const pathFileTsxFile = path.join(process.cwd(), './src/components/TextComponents', 'TextComponent.tsx');
const pathFileStyle = path.join(process.cwd(), './src/components/TextComponents', 'TextComponent.style.ts');
const pathFileType = path.join(process.cwd(), './src/components/TextComponents', 'TextComponent.type.ts');
const pathToCreateComponent = path.join(process.cwd(), './src/components/TextComponents/');
const downloadFile = (url, pathToCreate, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur : ${response.statusText}`);
        }
        const arrayBuffer = yield response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        createDirectoryIfNeeded(pathToCreate);
        writeFile(filePath, buffer);
    }
    catch (error) {
        console.log(error);
    }
});
const getDataPromptUser = () => __awaiter(void 0, void 0, void 0, function* () {
    yield downloadFile(fileUrlTsxFile, pathToCreateComponent, pathFileTsxFile);
    yield downloadFile(fileUrlType, pathToCreateComponent, pathFileType);
    yield downloadFile(fileUrlStyle, pathToCreateComponent, pathFileStyle);
    const config = loadConfig();
    if (config !== 404 && typeof config === 'object') {
        const data = yield inquirer.prompt([
            {
                type: 'input',
                name: 'fontSize',
                message: 'What font size do you want for your text ?',
            },
            {
                type: 'input',
                name: 'styleName',
                message: 'What style name do you want for your text style ?',
            },
            {
                type: 'list',
                name: 'font',
                message: 'What font size do you want for your text ?',
                choices: config.fonts,
            },
        ]);
        addTextStyle(data, pathFileStyle);
    }
});
function addTextStyle(data, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fontSplit = data.font.split('_');
            let fileContent = yield readFile(filePath, { encoding: 'utf8' });
            const styleContent = `css\`\nfont-size:${data.fontSize}px;\nfont-family:"${fontSplit[0]}";\n font-weight:${fontSplit[2]};\nfont-style:${fontSplit[1]};\n\``;
            const newStyle = `  \n${data.styleName}:${styleContent},\n`;
            const insertionPoint = fileContent.indexOf('export const TextTypesStyles = {') +
                'export const TextTypesStyles = {'.length;
            fileContent =
                fileContent.slice(0, insertionPoint) + newStyle + fileContent.slice(insertionPoint);
            yield writeFile(filePath, fileContent);
            console.log('Style added successfully.');
        }
        catch (error) {
            console.error('Failed to add style:', error);
        }
    });
}
getDataPromptUser();
