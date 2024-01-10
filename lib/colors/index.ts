import inquirer from 'inquirer';
import shell from 'shelljs';
import { generateColorVariants } from '../utils/variantColorsGenerator.js';
import { createDirectoryIfNeeded } from '../utils/folder.js';
import { ConfigInterface, loadConfig } from '../utils/configFile.js';

interface Answers {
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
        type: 'input',
        name: 'primaryColor',
        message: 'Enter your primary color:',
        validate: validateHexColor,
      },
      {
        type: 'confirm',
        name: 'wantSecondaryColor',
        message: 'Do you want a secondary color?',
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
      },
      {
        type: 'confirm',
        name: 'variantColor',
        message: 'Do you want color variants from darkest to lightest?',
      },
      {
        type: 'confirm',
        name: 'generateCSS',
        message: 'Do you want to generate a CSS file with the colors?',
      },
      {
        type: 'confirm',
        name: 'generateTSFile',
        message: 'Do you want to generate a colors.js/ts file?',
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

function processAnswers(answers: Answers, config: ConfigInterface) {
  if (answers.generateCSS) {
    generateCSSFile(answers);
  }
  if (answers.generateTSFile) {
    generateTSFile(answers, config.language);
  }
}

function generateCSSFile(answers: Answers) {
  let content = ':root {\n';
  const config = loadConfig();
  let dir = '';
  if (typeof config === 'object') {
    if (
      config.framework === 'react' ||
      config.framework === 'vue' ||
      config.framework === 'unknown'
    ) {
      dir = '/src/styles';
    } else if (config.framework === 'nextjs' || config.framework === 'nuxt') {
      dir = '/styles';
    }
  }
  content += `  --primary-color: ${answers.primaryColor};\n`;
  if (answers.secondaryColor) {
    content += `  --secondary-color: ${answers.secondaryColor};\n`;
  }
  if (answers.blackAndWhite) {
    content += `  --black: #000;\n  --white: #fff;\n`;
  }
  if (answers.variantColor) {
    if (answers.primaryColor) {
      const variantPrimary = generateColorVariants(answers.primaryColor, 'primary', 'css');
      Object.keys(variantPrimary).forEach((key) => {
        content += `  ${key}: "${variantPrimary[key]}";\n`;
      });
    }
    if (answers.secondaryColor) {
      const variantSecondary = generateColorVariants(answers.secondaryColor, 'secondary', 'css');
      Object.keys(variantSecondary).forEach((key) => {
        content += `  ${key}: "${variantSecondary[key]}";\n`;
      });
    }
    if (answers.blackAndWhite) {
      const variantBlack = generateColorVariants('#000000', 'gray', 'css');
      Object.keys(variantBlack).forEach((key) => {
        content += `  ${key}: "${variantBlack[key]}";\n`;
      });
    }
  }
  content += '}\n';
  createDirectoryIfNeeded(process.cwd() + `${dir}`);
  shell.ShellString(content).to(process.cwd() + `${dir}/colors.css`);
}

function generateTSFile(answers: Answers, language: string) {
  let content = 'export const Colors = {\n';
  const config = loadConfig();
  let dir = '';
  if (typeof config === 'object') {
    if (
      config.framework === 'react' ||
      config.framework === 'vue' ||
      config.framework === 'unknown'
    ) {
      dir = '/src/theme';
    } else if (config.framework === 'nextjs' || config.framework === 'nuxt') {
      dir = '/theme';
    }
  }
  /*primary color generation*/
  if (answers.primaryColor) {
    content += `  PRIMARY: "${answers.primaryColor}",\n`;
  }
  /*secondary color generation*/
  if (answers.secondaryColor) {
    content += `  SECONDARY: "${answers.secondaryColor}",\n`;
  }
  /*black and white color generation*/
  if (answers.blackAndWhite) {
    content += `  BLACK: "#000",\n  WHITE: "#fff",\n`;
  }

  if (answers.variantColor) {
    if (answers.primaryColor) {
      const variantPrimary = generateColorVariants(answers.primaryColor, 'primary', 'ts');
      Object.keys(variantPrimary).forEach((key) => {
        content += `  ${key}: "${variantPrimary[key]}",\n`;
      });
    }
    if (answers.secondaryColor) {
      const variantSecondary = generateColorVariants(answers.secondaryColor, 'secondary', 'ts');
      Object.keys(variantSecondary).forEach((key) => {
        content += `  ${key}: "${variantSecondary[key]}",\n`;
      });
    }
    if (answers.blackAndWhite) {
      const variantBlack = generateColorVariants('#000000', 'gray', 'ts');
      Object.keys(variantBlack).forEach((key) => {
        content += `  ${key}: "${variantBlack[key]}",\n`;
      });
    }
  }

  content += '};\n';
  createDirectoryIfNeeded(process.cwd() + `${dir}`);
  const outputPath = language === 'TypeScript' ? `${dir}/Colors.ts` : `${dir}/theme/Colors.js`;
  shell.ShellString(content).to(process.cwd() + outputPath);
}
