import inquirer from 'inquirer';
import shell from 'shelljs';
import { generateColorVariants } from '../utils/variantColorsGenerator.js';
import { createDirectoryIfNeeded } from '../utils/folder.js';
import { loadConfig } from '../utils/configFile.js';

interface Answers {
  useAtomicDesign: boolean;
  configureColors: boolean;
  primaryColor: string;
  wantSecondaryColor: boolean;
  secondaryColor: string;
  blackAndWhite: boolean;
  variantColor: boolean;
  generateCSS: boolean;
  generateTSFile: boolean;
}

export const initialisationColors = async () => {
  const config = loadConfig();
  if (config !== 404 && typeof config === 'object' && config !== null) {
    const questions = [
      {
        type: 'confirm',
        name: 'configureColors',
        message: 'Do you want to configure color variables?',
      },
      {
        type: 'input',
        name: 'primaryColor',
        message: 'Enter your primary color:',
        validate: validateHexColor,
        when: (answers: Answers) => answers.configureColors,
      },
      {
        type: 'confirm',
        name: 'wantSecondaryColor',
        message: 'Do you want a secondary color?',
        when: (answers: Answers) => answers.configureColors,
      },
      {
        type: 'input',
        name: 'secondaryColor',
        message: 'Enter your secondary color:',
        validate: validateHexColor,
        when: (answers: Answers) => answers.wantSecondaryColor,
      },
      {
        type: 'confirm',
        name: 'blackAndWhite',
        message: 'Do you want black and white color variables?',
        when: (answers: Answers) => answers.configureColors,
      },
      {
        type: 'confirm',
        name: 'variantColor',
        message: 'Do you want color variants from darkest to lightest?',
        when: (answers: Answers) => answers.configureColors,
      },
      {
        type: 'confirm',
        name: 'generateCSS',
        message: 'Do you want to generate a CSS file with the colors?',
        when: (answers: Answers) => answers.configureColors,
      },
      {
        type: 'confirm',
        name: 'generateTSFile',
        message: 'Do you want to generate a colors.js/ts file?',
        when: (answers: Answers) => answers.configureColors,
      },
    ];

    inquirer.prompt(questions).then((answers: Answers) => {
      processAnswers(answers, config);
    });
  }
};

function validateHexColor(value: string): boolean | string {
  const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  return valid || 'Please enter a valid hexadecimal color (e.g., #FFFFFF)';
}

function processAnswers(answers: Answers, config: any) {
  if (answers.generateCSS) {
    generateCSSFile(answers);
  }

  if (answers.generateTSFile) {
    generateTSFile(answers, config.language);
  }
}

function generateCSSFile(answers: Answers) {
  let colorVariablesCSS = ':root {\n';
  const config = loadConfig();
  let dir = '';
  if (typeof config === 'object') {
    if (
      config.framework === 'react' ||
      config.framework === 'vue' ||
      config.framework === 'unknown'
    ) {
      dir = '/src';
    } else if (config.framework === 'nextjs' || config.framework === 'nuxt') {
      dir = '';
    }
  }
  if (answers.configureColors) {
    colorVariablesCSS += `  --primary-color: ${answers.primaryColor};\n`;
    if (answers.wantSecondaryColor) {
      colorVariablesCSS += `  --secondary-color: ${answers.secondaryColor};\n`;
    }
    if (answers.blackAndWhite) {
      colorVariablesCSS += `  --black: #000;\n  --white: #fff;\n`;
    }
    if (answers.variantColor) {
      const variantColorPrimaryCSS = generateColorVariants(answers.primaryColor, 'primary', 'css');
      Object.keys(variantColorPrimaryCSS).forEach((key) => {
        colorVariablesCSS += `  ${key}: ${variantColorPrimaryCSS[key]};\n`;
      });
      if (answers.wantSecondaryColor) {
        const variantColorSecondaryCSS = generateColorVariants(
          answers.secondaryColor,
          'secondary',
          'css',
        );
        Object.keys(variantColorSecondaryCSS).forEach((key) => {
          colorVariablesCSS += `  ${key}: ${variantColorSecondaryCSS[key]};\n`;
        });
      }
    }
  }

  colorVariablesCSS += '}\n';
  createDirectoryIfNeeded(process.cwd() + `${dir}/styles`);
  shell.ShellString(colorVariablesCSS).to(process.cwd() + `${dir}/styles/colors.css`);
}

function generateTSFile(answers: Answers, language: string) {
  let colorVariablesTS = 'export const Colors = {\n';
  const config = loadConfig();
  let dir = '';
  if (typeof config === 'object') {
    if (
      config.framework === 'react' ||
      config.framework === 'vue' ||
      config.framework === 'unknown'
    ) {
      dir = '/src';
    } else if (config.framework === 'nextjs' || config.framework === 'nuxt') {
      dir = '';
    }
  }
  if (answers.configureColors) {
    colorVariablesTS += `  PRIMARY: "${answers.primaryColor}",\n`;
    if (answers.wantSecondaryColor) {
      colorVariablesTS += `  SECONDARY: "${answers.secondaryColor}",\n`;
    }
    if (answers.blackAndWhite) {
      colorVariablesTS += `  BLACK: "#000",\n  WHITE: "#fff",\n`;
    }
    if (answers.variantColor) {
      const variantColorPrimaryTS = generateColorVariants(answers.primaryColor, 'primary', 'ts');
      Object.keys(variantColorPrimaryTS).forEach((key) => {
        colorVariablesTS += `  ${key}: "${variantColorPrimaryTS[key]}",\n`;
      });
      if (answers.wantSecondaryColor) {
        const variantColorSecondaryTS = generateColorVariants(
          answers.secondaryColor,
          'secondary',
          'ts',
        );
        Object.keys(variantColorSecondaryTS).forEach((key) => {
          colorVariablesTS += `  ${key}: "${variantColorSecondaryTS[key]}",\n`;
        });
      }
    }
  }

  colorVariablesTS += '};\n';
  createDirectoryIfNeeded(process.cwd() + `${dir}/theme`);
  const outputPath =
    language === 'TypeScript' ? `${dir}/theme/Colors.ts` : `${dir}/theme/Colors.js`;
  shell.ShellString(colorVariablesTS).to(process.cwd() + outputPath);
}
