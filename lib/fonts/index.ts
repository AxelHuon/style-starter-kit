import inquirer from 'inquirer';
import {
  addContentToCssFile,
  downloadFont,
  genereateCSSContent,
  getGooglFontsData,
  parseFontsIntoJson,
} from '../utils/fonts.js';
import { loadConfig, writeConfigFile } from '../utils/configFile.js';
import { QuestionCollection } from 'inquirer';

export const downloadFontsAndGenereateCSS = async () => {
  const config = loadConfig();
  const fontPrompt = await selectFont();
  const { cssText, fontName, error } = await getGooglFontsData(fontPrompt);
  let dataFontsJson;
  if (!error && cssText && fontName) {
    dataFontsJson = parseFontsIntoJson(cssText, fontName);
    if (dataFontsJson) {
      for (let i = 0; i < dataFontsJson.fontsData.length; i++) {
        if (typeof config === 'object') {
          if (
            typeof config.fonts === 'string' &&
            config.fonts === dataFontsJson.fontsData[i].fontsVariant
          ) {
            console.log('Font already download');
            return;
          } else if (
            Array.isArray(config.fonts) &&
            config.fonts.includes(dataFontsJson.fontsData[i].fontsVariant)
          ) {
            console.log('Font already download');
            return;
          }
        }
        const responseDownload = await downloadFont(
          dataFontsJson.fontsData[i].fontUrl,
          dataFontsJson.fontsData[i].fontsVariant,
        );
        if (responseDownload && typeof responseDownload === 'string') {
          const cssContent = genereateCSSContent(
            responseDownload,
            dataFontsJson.fontsData[i],
            fontName,
          );
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
};

const FONTS: string[] = ['Roboto', 'Open Sans', 'Lato', 'Add Custom Font'];

interface FontSelection {
  fontFamily: string;
  customUrl?: string;
}

async function selectFont(): Promise<string> {
  const FONT_BASE_URL = 'https://fonts.google.com/specimen/';
  const questions: QuestionCollection<FontSelection> = [
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
      message: 'Enter the Google Fonts URL: (e.g. https://fonts.google.com/specimen/your-font)',
      when: (answers: FontSelection) => answers.fontFamily === 'Add Custom Font',
      validate: (inputUrl: string): boolean | string => {
        if (!inputUrl.startsWith(FONT_BASE_URL)) {
          return 'Please enter a valid Google Fonts URL.';
        }
        return true;
      },
    },
  ];

  const answers = await inquirer.prompt(questions);
  if (answers.fontFamily === 'Add Custom Font') {
    return extractFontNameFromUrl(answers.customUrl ?? '');
  }
  return answers.fontFamily;
}

function extractFontNameFromUrl(url: string): string {
  const matches = url.match(/https:\/\/fonts\.google\.com\/specimen\/([^?]+)/);
  if (matches && matches[1]) {
    return decodeURIComponent(matches[1].replace(/\+/g, ' '));
  }
  throw new Error('Invalid URL format');
}
