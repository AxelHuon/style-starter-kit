// Importation des modules nécessaires
import fetch from 'node-fetch';
import { writeFile, readFile } from 'fs/promises';
import { createDirectoryIfNeeded } from '../utils/folder.js';
import path from 'path';
import process from 'process';
import inquirer from 'inquirer';
import { loadConfig } from '../utils/configFile.js';

interface DataPrompt {
  styleName: string;
  fontSize: number;
  font: string;
}

const fileUrlTsxFile =
  'https://raw.githubusercontent.com/AxelHuon/style-starter-kit/feat/text-component/templates/components/TextComponents/TextComponents.tsx';

const fileUrlStyle =
  'https://raw.githubusercontent.com/AxelHuon/style-starter-kit/feat/text-component/templates/components/TextComponents/TextComponent.style.ts';

const fileUrlType =
  'https://raw.githubusercontent.com/AxelHuon/style-starter-kit/feat/text-component/templates/components/TextComponents/TextComponent.type.ts';

const pathFileTsxFile = path.join(
  process.cwd(),
  './src/components/TextComponents',
  'TextComponent.tsx',
);

const pathFileStyle = path.join(
  process.cwd(),
  './src/components/TextComponents',
  'TextComponent.style.ts',
);

const pathFileType = path.join(
  process.cwd(),
  './src/components/TextComponents',
  'TextComponent.type.ts',
);

const pathToCreateComponent = path.join(process.cwd(), './src/components/TextComponents/');
const downloadFile = async (url: string, pathToCreate: string, filePath: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    createDirectoryIfNeeded(pathToCreate);
    writeFile(filePath, buffer);
  } catch (error) {
    console.log(error);
  }
};

const getDataPromptUser = async () => {
  await downloadFile(fileUrlTsxFile, pathToCreateComponent, pathFileTsxFile);
  await downloadFile(fileUrlType, pathToCreateComponent, pathFileType);
  await downloadFile(fileUrlStyle, pathToCreateComponent, pathFileStyle);
  const config = loadConfig();
  if (config !== 404 && typeof config === 'object') {
    const data: DataPrompt = await inquirer.prompt([
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
};

async function addTextStyle(data: DataPrompt, filePath: string) {
  try {
    const fontSplit = data.font.split('_');
    let fileContent = await readFile(filePath, { encoding: 'utf8' });
    const styleContent = `css\`\nfont-size:${data.fontSize}px;\nfont-family:"${fontSplit[0]}";\n font-weight:${fontSplit[2]};\nfont-style:${fontSplit[1]};\n\``;
    const newStyle = `  \n${data.styleName}:${styleContent},\n`;
    const insertionPoint =
      fileContent.indexOf('export const TextTypesStyles = {') +
      'export const TextTypesStyles = {'.length;
    fileContent =
      fileContent.slice(0, insertionPoint) + newStyle + fileContent.slice(insertionPoint);
    await writeFile(filePath, fileContent);
    console.log('Style added successfully.');
  } catch (error) {
    console.error('Failed to add style:', error);
  }
}

getDataPromptUser();
