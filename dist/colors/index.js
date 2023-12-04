#!/usr/bin/env node
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
import { generateColorVariants } from "../utils/variantColorsGenerator.js";
import shell from "shelljs";
import { createDirectoryIfNeeded } from "../utils/folder.js";
import { loadConfig } from "../utils/configFile.js";
export const initialisationColors = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield loadConfig("colors");
    if (config !== 404 && typeof config === "object" && config !== null) {
        const questions = [
            {
                type: "confirm",
                name: "configureColors",
                message: "Do you want to configure color variables?",
            },
            {
                type: "input",
                name: "primaryColor",
                message: "Enter your primary color:",
                validate: function (value) {
                    const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
                    return (valid ||
                        "Please enter a valid hexadecimal color (e.g., #FFFFFF)");
                },
                when: (answers) => answers.configureColors,
            },
            {
                type: "confirm",
                name: "wantSecondaryColor",
                message: "Do you want a secondary color ?",
                when: (answers) => answers.configureColors,
            },
            {
                type: "input",
                name: "secondaryColor",
                message: "Enter your secondary color:",
                validate: function (value) {
                    const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
                    return (valid ||
                        "Please enter a valid hexadecimal color (e.g., #FFFFFF)");
                },
                when: (answers) => answers.wantSecondaryColor,
            },
            {
                type: "confirm",
                name: "blackAndWhite",
                message: "Do you want black and white color variables?",
                when: (answers) => answers.configureColors,
            },
            {
                type: "confirm",
                name: "variantColor",
                message: "Do you want color variants from darkest to lightest?",
                when: (answers) => answers.configureColors,
            },
            {
                type: "confirm",
                name: "generateCSS",
                message: "Do you want to generate a CSS file with the colors?",
                when: (answers) => answers.configureColors,
            },
            {
                type: "confirm",
                name: "generateTSFile",
                message: "Do you want to generate a colors.js/ts file?",
                when: (answers) => answers.configureColors,
            },
        ];
        inquirer.prompt(questions).then((answers) => {
            if (answers.generateCSS) {
                let colorVariablesCSS = `
          :root {
            --primary-color: ${answers.primaryColor};
           
        `;
                if (answers.wantSecondaryColor) {
                    colorVariablesCSS += `
            --secondary-color: ${answers.secondaryColor};
          `;
                }
                if (answers.blackAndWhite) {
                    colorVariablesCSS += `
            --black: #000;
            --white: #fff;
          `;
                }
                if (answers.variantColor) {
                    let variantColorPrimaryCSS = generateColorVariants(answers.primaryColor, "primary", "css");
                    for (const key in variantColorPrimaryCSS) {
                        if (variantColorPrimaryCSS.hasOwnProperty(key)) {
                            colorVariablesCSS += `
                    ${key}:  ${variantColorPrimaryCSS[key]};
                  `;
                        }
                    }
                    if (answers.wantSecondaryColor) {
                        let variantColorSeondaryCSS = generateColorVariants(answers.secondaryColor, "seondary", "css");
                        for (const key in variantColorSeondaryCSS) {
                            if (variantColorSeondaryCSS.hasOwnProperty(key)) {
                                colorVariablesCSS += `
                      ${key}:  ${variantColorSeondaryCSS[key]};
                    `;
                            }
                        }
                    }
                    if (answers.blackAndWhite) {
                        let variantColorGrayCSS = generateColorVariants("#000000", "gray", "css");
                        for (const key in variantColorGrayCSS) {
                            if (variantColorGrayCSS.hasOwnProperty(key)) {
                                colorVariablesCSS += `
                    ${key}:  ${variantColorGrayCSS[key]};
                  `;
                            }
                        }
                    }
                }
                colorVariablesCSS += `}`;
                createDirectoryIfNeeded(process.cwd() + "/style");
                shell.ShellString(colorVariablesCSS).to(process.cwd() + "/style/colors.css");
            }
            if (answers.generateTSFile) {
                let colorVariablesTS = `
          export const Colors = {
            PRIMARY: "${answers.primaryColor}",    
        `;
                if (answers.wantSecondaryColor) {
                    colorVariablesTS = `
            SECONDARY: "${answers.secondaryColor}",    
          `;
                }
                if (answers.blackAndWhite) {
                    colorVariablesTS += `
            BLACK: "#000",
            WHITE: "#fff",
          `;
                }
                if (answers.variantColor) {
                    let variantColorPrimaryTS = generateColorVariants(answers.primaryColor, "primary", "ts");
                    for (const key in variantColorPrimaryTS) {
                        if (variantColorPrimaryTS.hasOwnProperty(key)) {
                            colorVariablesTS += `
                    ${key}:  "${variantColorPrimaryTS[key]}",
                  `;
                        }
                    }
                    if (answers.wantSecondaryColor) {
                        let variantColorSeondaryTS = generateColorVariants(answers.secondaryColor, "secondary", "ts");
                        for (const key in variantColorSeondaryTS) {
                            if (variantColorSeondaryTS.hasOwnProperty(key)) {
                                colorVariablesTS += `
                      ${key}:  "${variantColorSeondaryTS[key]}",
                    `;
                            }
                        }
                    }
                    if (answers.blackAndWhite) {
                        let variantColorGrayTS = generateColorVariants("#00000", "gray", "ts");
                        for (const key in variantColorGrayTS) {
                            if (variantColorGrayTS.hasOwnProperty(key)) {
                                colorVariablesTS += `
                    ${key}:  "${variantColorGrayTS[key]}",
                  `;
                            }
                        }
                    }
                }
                colorVariablesTS += `}`;
                createDirectoryIfNeeded(process.cwd() + "/theme");
                let outputPath = (config === null || config === void 0 ? void 0 : config.language) === "TypeScript" ? "./theme/Colors.ts" : "./theme/Colors.js";
                shell.ShellString(colorVariablesTS).to(process.cwd() + "/" + outputPath);
            }
        });
    }
});
