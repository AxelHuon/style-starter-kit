#!/usr/bin/env node

import shell from "shelljs";
import inquirer from "inquirer";
import { generateColorVariants } from "./colors/variantColorsGenerator.js";

interface Answers {
  useAtomicDesign: boolean;
  configureColors: boolean;
  primaryColor: string;
  secondaryColor: string;
  blackAndWhite: boolean;
  variantColor: boolean;
  generateCSS: boolean;
  generateTSFile: boolean;
}

const runPrettierOnFile = (filePath: string) => {
  shell.exec(`npx prettier --write ${filePath}`);
};

const initialisationThemingReactCli = () => {
  const questions = [
    {
      type: "confirm",
      name: "useAtomicDesign",
      message: "Voulez-vous utiliser Atomic Design?",
    },
    {
      type: "confirm",
      name: "configureColors",
      message: "Voulez-vous configurer des variables de couleurs?",
      when: (answers: Answers) => answers.useAtomicDesign,
    },
    {
      type: "input",
      name: "primaryColor",
      message: "Entrez votre couleur primaire:",
      validate: function (value: string) {
        const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        return (
          valid ||
          "Veuillez entrer une couleur hexadécimale valide (ex: #FFFFFF)"
        );
      },
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "input",
      name: "secondaryColor",
      message: "Entrez votre couleur secondaire:",
      validate: function (value: string) {
        const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        return (
          valid ||
          "Veuillez entrer une couleur hexadécimale valide (ex: #FFFFFF)"
        );
      },
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "confirm",
      name: "blackAndWhite",
      message: "Voulez-vous des variables de couleurs noir et blanc?",
      when: (answers: Answers) => answers.configureColors,
    },

    {
      type: "confirm",
      name: "variantColor",
      message:
        "Voulez vous les variantes de couleurs du plus foncés au moins foncés ?",
      when: (answers: Answers) => answers.configureColors,
    },

    {
      type: "confirm",
      name: "generateCSS",
      message: "Voulez-vous générer un fichier CSS avec les couleurs ?",
      when: (answers: Answers) => answers.configureColors,
    },
    {
      type: "confirm",
      name: "generateTSFile",
      message: "Voulez-vous générer un fichier colors.ts?",
      when: (answers: Answers) => answers.configureColors,
    },
  ];

  inquirer.prompt(questions).then((answers: Answers) => {
    if (answers.useAtomicDesign) {
      shell.mkdir("-p", "src/Atoms");
      shell.mkdir("-p", "src/Molecules");
      console.log("Dossiers Atoms et Molecules créés dans src/");
    }

    if (answers.generateCSS) {
      let colorVariablesCSS = `
          :root {
            --primary-color: ${answers.primaryColor};
            --secondary-color: ${answers.secondaryColor};
            
        `;

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

      shell.ShellString(colorVariablesCSS).to("src/colors.css");
      console.log("Variables de couleurs enregistrées dans src/colors.css");
      runPrettierOnFile("src/colors.css");
    }

    if (answers.generateTSFile) {
      shell.mkdir("-p", "src/theme");
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
      shell.ShellString(colorVariablesTS).to("src/theme/Colors.ts");
      console.log(
        "Variables de couleurs enregistrées dans src/theme/colors.ts",
      );
      runPrettierOnFile("src/theme/Colors.ts");
    }
  });
};

const args = process.argv.slice(2);

if (args[0] === "init") {
  initialisationThemingReactCli();
}
