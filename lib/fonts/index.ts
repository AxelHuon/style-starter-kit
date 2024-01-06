import inquirer from 'inquirer';
import {
  addContentToCssFile,
  downloadFont,
  genereateCSSContent,
  getGooglFontsData,
  parseFontsIntoJson,
} from '../utils/fonts.js';
import { loadConfig, writeConfigFile } from '../utils/configFile.js';


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
            console.log(addContentCss);
            if (addContentCss) {
              writeConfigFile('fonts', dataFontsJson.fontsData[i].fontsVariant, 'appendToArray');
            }
          }
        }
      }
    }
  }
};

const FONTS: string[] = ['Roboto', 'Open Sans', 'Lato', 'Montserrat'];
async function selectFont(): Promise<string> {
  const questions = [
    {
      type: 'list',
      name: 'fontFamily',
      message: 'Quelle police souhaitez-vous télécharger?',
      choices: FONTS,
      default: FONTS[0],
    },
  ];
  const answers = await inquirer.prompt(questions);
  return answers.fontFamily;
}

