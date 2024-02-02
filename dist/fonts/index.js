var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from 'inquirer';
import { addContentToCssFile, downloadFont, genereateCSSContent, getGooglFontsData, parseFontsIntoJson, } from '../utils/fonts.js';
import { loadConfig, writeConfigFile } from '../utils/configFile.js';
export const downloadFontsAndGenereateCSS = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = loadConfig();
    const fontPrompt = yield selectFont();
    const { cssText, fontName, error } = yield getGooglFontsData(fontPrompt);
    let dataFontsJson;
    if (!error && cssText && fontName) {
        dataFontsJson = parseFontsIntoJson(cssText, fontName);
        if (dataFontsJson) {
            for (let i = 0; i < dataFontsJson.fontsData.length; i++) {
                if (typeof config === 'object') {
                    if (typeof config.fonts === 'string' &&
                        config.fonts === dataFontsJson.fontsData[i].fontsVariant) {
                        console.log('Font already download');
                        return;
                    }
                    else if (Array.isArray(config.fonts) &&
                        config.fonts.includes(dataFontsJson.fontsData[i].fontsVariant)) {
                        console.log('Font already download');
                        return;
                    }
                }
                const responseDownload = yield downloadFont(dataFontsJson.fontsData[i].fontUrl, dataFontsJson.fontsData[i].fontsVariant);
                if (responseDownload && typeof responseDownload === 'string') {
                    const cssContent = genereateCSSContent(responseDownload, dataFontsJson.fontsData[i], fontName);
                    if (typeof cssContent === 'string') {
                        const addContentCss = addContentToCssFile(cssContent);
                        if (addContentCss) {
                            writeConfigFile('fonts', dataFontsJson.fontsData[i].fontsVariant, 'appendToArray');
                        }
                    }
                }
            }
        }
    }
});
const FONTS = ['Roboto', 'Open Sans', 'Lato', 'Add Custom Font'];
function selectFont() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const FONT_BASE_URL = 'https://fonts.google.com/specimen/';
        const questions = [
            {
                type: 'list',
                name: 'fontFamily',
                message: 'Which font would you like to download?',
                choices: FONTS,
                default: FONTS[0],
            },
            {
                type: 'input',
                name: 'customUrl',
                message: 'Enter the Google Fonts URL:',
                when: (answers) => answers.fontFamily === 'Add Custom Font',
                validate: (inputUrl) => {
                    if (!inputUrl.startsWith(FONT_BASE_URL)) {
                        return 'Please enter a valid Google Fonts URL.';
                    }
                    return true;
                },
            },
        ];
        const answers = yield inquirer.prompt(questions);
        if (answers.fontFamily === 'Add Custom Font') {
            return extractFontNameFromUrl((_a = answers.customUrl) !== null && _a !== void 0 ? _a : '');
        }
        return answers.fontFamily;
    });
}
function extractFontNameFromUrl(url) {
    const matches = url.match(/https:\/\/fonts\.google\.com\/specimen\/([^?]+)/);
    if (matches && matches[1]) {
        return decodeURIComponent(matches[1].replace(/\+/g, ' '));
    }
    throw new Error('Invalid URL format');
}
