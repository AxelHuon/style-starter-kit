#!/usr/bin/env node

import inquirer from "inquirer";
import { generateColorVariants } from "../utils/variantColorsGenerator.js";
import shell from "shelljs";
import config from "../config.js";

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

export const initialisationColors= () => {
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
      validate: function (value: string) {
        const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        return (
          valid ||
          "Please enter a valid hexadecimal color (e.g., #FFFFFF)"
        );
      },
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "confirm",
      name: "wantSecondaryColor",
      message: "Do you want a secondary color ?",
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "input",
      name: "secondaryColor",
      message: "Enter your secondary color:",
      validate: function (value: string) {
        const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        return (
          valid ||
          "Please enter a valid hexadecimal color (e.g., #FFFFFF)"
        );
      },
      when: (answers: Answers) => answers.wantSecondaryColor,
    },
    {
      type: "confirm",
      name: "blackAndWhite",
      message: "Do you want black and white color variables?",
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "confirm",
      name: "variantColor",
      message: "Do you want color variants from darkest to lightest?",
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "confirm",
      name: "generateCSS",
      message: "Do you want to generate a CSS file with the colors?",
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "confirm",
      name: "generateTSFile",
      message: "Do you want to generate a colors.js/ts file?",
      when: (answers: Answers) => answers.configureColors,
    },
  ];

  inquirer.prompt(questions).then((answers: Answers) => {

    if (answers.generateCSS) {
      let colorVariablesCSS = `
          :root {
            --primary-color: ${answers.primaryColor};
           
        `;
      if(answers.wantSecondaryColor){
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
        let variantColorPrimaryCSS = generateColorVariants(
          answers.primaryColor,
          "primary",
          "css",
        );
        for (const key in variantColorPrimaryCSS) {
          if (variantColorPrimaryCSS.hasOwnProperty(key)) {
            colorVariablesCSS += `
                    ${key}:  ${variantColorPrimaryCSS[key]};
                  `;
          }
        }
        if(answers.wantSecondaryColor){
        let variantColorSeondaryCSS = generateColorVariants(
          answers.secondaryColor,
          "seondary",
          "css",
        );
          for (const key in variantColorSeondaryCSS) {
            if (variantColorSeondaryCSS.hasOwnProperty(key)) {
              colorVariablesCSS += `
                      ${key}:  ${variantColorSeondaryCSS[key]};
                    `;
            }
          }
        }
        if (answers.blackAndWhite) {
          let variantColorGrayCSS = generateColorVariants(
            "#000000",
            "gray",
            "css",
          );
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
      shell.ShellString(colorVariablesCSS).to("lib/colors.css");
      console.log("Variables de couleurs enregistrées dans lib/colors.css");
    }

    if (answers.generateTSFile) {
      shell.mkdir("-p", "lib/theme");
      let colorVariablesTS = `
          export const Colors = {
            PRIMARY: "${answers.primaryColor}",
            SECONDARY: "${answers.secondaryColor}",
    
        `;
      if (answers.blackAndWhite) {
        colorVariablesTS += `
            BLACK: "#000",
            WHITE: "#fff",
          `;
      }
      if (answers.variantColor) {
        let variantColorPrimaryTS = generateColorVariants(
          answers.primaryColor,
          "primary",
          "ts",
        );
        for (const key in variantColorPrimaryTS) {
          if (variantColorPrimaryTS.hasOwnProperty(key)) {
            colorVariablesTS += `
                    ${key}:  "${variantColorPrimaryTS[key]}",
                  `;
          }
        }
        if (answers.wantSecondaryColor){
          let variantColorSeondaryTS = generateColorVariants(
            answers.secondaryColor,
            "secondary",
            "ts",
          );
          for (const key in variantColorSeondaryTS) {
            if (variantColorSeondaryTS.hasOwnProperty(key)) {
              colorVariablesTS += `
                      ${key}:  "${variantColorSeondaryTS[key]}",
                    `;
            }
          }
        }
        if (answers.blackAndWhite) {
          let variantColorGrayTS = generateColorVariants(
            "#00000",
            "gray",
            "ts",
          );
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

      if(config.language === "TypeScript"){
        shell.ShellString(colorVariablesTS).to("lib/theme/Colors.ts");
      }else if (config.language === "JavaScript"){
        shell.ShellString(colorVariablesTS).to("lib/theme/Colors.js");
      }
    }
  });
};
