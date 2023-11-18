import fs from 'fs';
import path from 'path';
import { writeConfigFile } from "../utils/writeConfigFile.js";
import inquirer from "inquirer";
import { execSync } from "child_process";
import { installLibrary } from "../utils/libInstall.js";


const  detectFramework = ():string =>  {
  // Vérifier pour Next.js
  if (fs.existsSync(path.join(process.cwd(), 'pages')) && fs.existsSync(path.join(process.cwd(), 'next.config.js')) || fs.existsSync(path.join(process.cwd(), 'next.config.ts'))) {
    return 'nextjs';
  }

  // Vérifier pour React (peut être amélioré en vérifiant les dépendances dans package.json)
  if (fs.existsSync(path.join(process.cwd(), 'src', 'index.js')) || fs.existsSync(path.join(process.cwd(), 'src', 'App.js')) || fs.existsSync(path.join(process.cwd(), 'src', 'index.tsx')) || fs.existsSync(path.join(process.cwd(), 'src', 'App.tsx'))) {
    return 'react';
  }

  // Vérifier pour Vue
  if (fs.existsSync(path.join(process.cwd(), 'vue.config.js')) || fs.existsSync(path.join(process.cwd(), 'vue.config.ts'))) {
    return 'vue';
  }

  // Vérifier pour Nuxt.js
  if (fs.existsSync(path.join(process.cwd(), 'nuxt.config.js')) || fs.existsSync(path.join(process.cwd(), 'nuxt.config.ts'))) {
    return 'nuxt';
  }
  return 'unknow';
}


function askTypeScriptOrJavaScript():Promise<{ languageChoice:string}> {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'languageChoice',
      message: 'Voulez-vous utiliser TypeScript ou JavaScript?',
      choices: ['TypeScript', 'JavaScript']
    }
  ]);
}

function askLibStyle():Promise<{ libStyleChoice:string}> {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'libStyleChoice',
      message: 'Voulez-vous utiliser styled-components ou css-modules?',
      choices: ['styled-components', 'css-modules']
    }
  ]);
}


export const initLib = async ()=>{

  const frameworkValue:string = detectFramework()
  writeConfigFile("framework",frameworkValue)

  const language = await askTypeScriptOrJavaScript()
  writeConfigFile("language",language.languageChoice)

  const styleLib = await askLibStyle()
  writeConfigFile("styleLib",styleLib.libStyleChoice)

  if(styleLib.libStyleChoice === "styled-components") {
    installLibrary("styled-components")
  }
}