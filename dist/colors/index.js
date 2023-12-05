var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import shell from "shelljs";
import { generateColorVariants } from "../utils/variantColorsGenerator.js";
import { createDirectoryIfNeeded } from "../utils/folder.js";
import { loadConfig } from "../utils/configFile.js";
export const initialisationColors = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = loadConfig();
    if (config !== 404 && typeof config === "object" && config !== null) {
        const questions = [
            {
                type: "confirm",
                name: "configureColors",
                message: "Do you want to configure color variables?"
            },
            {
                type: "input",
                name: "primaryColor",
                message: "Enter your primary color:",
                validate: validateHexColor,
                when: (answers) => answers.configureColors
            },
            {
                type: "confirm",
                name: "wantSecondaryColor",
                message: "Do you want a secondary color?",
                when: (answers) => answers.configureColors
            },
            {
                type: "input",
                name: "secondaryColor",
                message: "Enter your secondary color:",
                validate: validateHexColor,
                when: (answers) => answers.wantSecondaryColor
            },
            {
                type: "confirm",
                name: "blackAndWhite",
                message: "Do you want black and white color variables?",
                when: (answers) => answers.configureColors
            },
            {
                type: "confirm",
                name: "variantColor",
                message: "Do you want color variants from darkest to lightest?",
                when: (answers) => answers.configureColors
            },
            {
                type: "confirm",
                name: "generateCSS",
                message: "Do you want to generate a CSS file with the colors?",
                when: (answers) => answers.configureColors
            },
            {
                type: "confirm",
                name: "generateTSFile",
                message: "Do you want to generate a colors.js/ts file?",
                when: (answers) => answers.configureColors
            }
        ];
        inquirer.prompt(questions).then((answers) => {
            processAnswers(answers, config);
        });
    }
});
function validateHexColor(value) {
    const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
    return valid || "Please enter a valid hexadecimal color (e.g., #FFFFFF)";
}
function processAnswers(answers, config) {
    if (answers.generateCSS) {
        generateCSSFile(answers);
    }
    if (answers.generateTSFile) {
        generateTSFile(answers, config.language);
    }
}
function generateCSSFile(answers) {
    let colorVariablesCSS = ":root {\n";
    if (answers.configureColors) {
        colorVariablesCSS += `  --primary-color: ${answers.primaryColor};\n`;
        if (answers.wantSecondaryColor) {
            colorVariablesCSS += `  --secondary-color: ${answers.secondaryColor};\n`;
        }
        if (answers.blackAndWhite) {
            colorVariablesCSS += `  --black: #000;\n  --white: #fff;\n`;
        }
        if (answers.variantColor) {
            const variantColorPrimaryCSS = generateColorVariants(answers.primaryColor, "primary", "css");
            Object.keys(variantColorPrimaryCSS).forEach(key => {
                colorVariablesCSS += `  ${key}: ${variantColorPrimaryCSS[key]};\n`;
            });
            if (answers.wantSecondaryColor) {
                const variantColorSecondaryCSS = generateColorVariants(answers.secondaryColor, "secondary", "css");
                Object.keys(variantColorSecondaryCSS).forEach(key => {
                    colorVariablesCSS += `  ${key}: ${variantColorSecondaryCSS[key]};\n`;
                });
            }
        }
    }
    colorVariablesCSS += "}\n";
    createDirectoryIfNeeded(process.cwd() + "/style");
    shell.ShellString(colorVariablesCSS).to(process.cwd() + "/style/colors.css");
}
function generateTSFile(answers, language) {
    let colorVariablesTS = "export const Colors = {\n";
    if (answers.configureColors) {
        colorVariablesTS += `  PRIMARY: "${answers.primaryColor}",\n`;
        if (answers.wantSecondaryColor) {
            colorVariablesTS += `  SECONDARY: "${answers.secondaryColor}",\n`;
        }
        if (answers.blackAndWhite) {
            colorVariablesTS += `  BLACK: "#000",\n  WHITE: "#fff",\n`;
        }
        if (answers.variantColor) {
            const variantColorPrimaryTS = generateColorVariants(answers.primaryColor, "primary", "ts");
            Object.keys(variantColorPrimaryTS).forEach(key => {
                colorVariablesTS += `  ${key}: "${variantColorPrimaryTS[key]}",\n`;
            });
            if (answers.wantSecondaryColor) {
                const variantColorSecondaryTS = generateColorVariants(answers.secondaryColor, "secondary", "ts");
                Object.keys(variantColorSecondaryTS).forEach(key => {
                    colorVariablesTS += `  ${key}: "${variantColorSecondaryTS[key]}",\n`;
                });
            }
        }
    }
    colorVariablesTS += "};\n";
    createDirectoryIfNeeded(process.cwd() + "/theme");
    let outputPath = language === "TypeScript" ? "/theme/Colors.ts" : "/theme/Colors.js";
    shell.ShellString(colorVariablesTS).to(process.cwd() + outputPath);
}
