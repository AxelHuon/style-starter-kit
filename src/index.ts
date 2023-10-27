#!/usr/bin/env node
import shell from "shelljs";
import inquirer from "inquirer";

interface Answers {
    useAtomicDesign: boolean;
    configureColors: boolean;
    primaryColor: string;
    secondaryColor: string;
    blackAndWhite: boolean;
    generateCSS:boolean
    generateTS:boolean
    variantColor:boolean
}

const questions = [
    {
        type: 'confirm',
        name: 'useAtomicDesign',
        message: 'Voulez-vous utiliser Atomic Design?',
    },
    {
        type: 'confirm',
        name: 'configureColors',
        message: 'Voulez-vous configurer des variables de couleurs?',
        when: (answers:Answers) => answers.useAtomicDesign,
    },
    {
        type: 'input',
        name: 'primaryColor',
        message: 'Entrez votre couleur primaire:',
        validate: function(value: string) {
            const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
            return valid || 'Veuillez entrer une couleur hexadécimale valide (ex: #FFFFFF)';
        },
        when: (answers:Answers) => answers.configureColors,
    },
    {
        type: 'input',
        name: 'secondaryColor',
        message: 'Entrez votre couleur secondaire:',
        validate: function(value: string) {
            const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
            return valid || 'Veuillez entrer une couleur hexadécimale valide (ex: #FFFFFF)';
        },
        when: (answers:Answers) => answers.configureColors,
    },
    {
        type: 'confirm',
        name: 'blackAndWhite',
        message: 'Voulez-vous des variables de couleurs noir et blanc?',
        when: (answers:Answers) => answers.configureColors,
    },

    {
        type: 'confirm',
        name: 'generateTS',
        message: 'Voulez vous les variantes de couleurs du plus foncés au moins foncés',
        when: (answers:Answers) => answers.variantColor,
    },

    {
        type: 'confirm',
        name: 'generateCSS',
        message: 'Voulez-vous générer un fichier CSS avec les couleurs?',
        when: (answers:Answers) => answers.configureColors,
    },
    {
        type: 'confirm',
        name: 'generateTS',
        message: 'Voulez-vous générer un fichier colors.ts?',
        when: (answers:Answers) => answers.configureColors,
    },
    {
        type: 'confirm',
        name: 'generateTS',
        message: 'Voulez vous les variantes de couleurs du plus foncés au moins foncés',
        when: (answers:Answers) => answers.variantColor,
    },
];

inquirer.prompt(questions).then((answers: Answers) => {
    if (answers.useAtomicDesign) {
        shell.mkdir('-p', 'src/Atoms');
        shell.mkdir('-p', 'src/Molecules');
        console.log('Dossiers Atoms et Molecules créés dans src/');
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

        colorVariablesCSS += `}`

        shell.ShellString(colorVariablesCSS).to('src/colors.css');
        console.log('Variables de couleurs enregistrées dans src/colors.css');
    }

    if (answers.generateTS) {
        shell.mkdir('-p', 'src/theme');
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
        colorVariablesTS += `}`
        shell.ShellString(colorVariablesTS).to('src/theme/Colors.ts');
        console.log('Variables de couleurs enregistrées dans src/theme/colors.ts');
    }
});







