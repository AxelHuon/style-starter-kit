import inquirer from "inquirer";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import {createDirectoryIfNeeded} from "../utils/folder.js";
import {loadConfig} from "../utils/configFile.js";



const FONTS: string[] = [
  "Roboto",
  "Open Sans",
  "Lato",
];

async function selectFont(): Promise<string> {
  const questions = [
    {
      type: "list",
      name: "fontFamily",
      message: "Quelle police souhaitez-vous télécharger?",
      choices: FONTS,
      default: FONTS[0],
    },
  ];
  const answers = await inquirer.prompt(questions);
  return answers.fontFamily;
}

async function downloadFontFamily(fontFamily: string): Promise<void> {

  const config = await loadConfig("colors");


  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontFamily
  )}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap`;
  console.log(fontUrl);
  try {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération du CSS de la police : ${fontUrl}`
      );
    }

    const fontCss: string = await response.text();
    const fontFaceSections: string[] = fontCss.split(/@font-face\s*\{/);
    let newFontCss: string = fontCss;

    if (fontCss) {
      console.log(
        `Le CSS de la police ${fontFamily} a été récupéré avec succès.`
      );
      for (const section of fontFaceSections) {
        const urlMatch = section.match(/url\(['"]?([^'"]+)['"]?\)/);
        const weightMatch = section.match(/font-weight:\s*(\d+)/);
        const styleMatch = section.match(/font-style:\s*(\w+)/);

        if (urlMatch && weightMatch && styleMatch) {
          const url: string = urlMatch[1];
          const weight: string = weightMatch[1];
          const style: string = styleMatch[1];
          const fileExtension: string = path.extname(url);
          let fontDirectory:string = ""
          if (config !== 404 && typeof config === "object" && config!==null) {
            if (config?.framework === "react" || "vue" || "unknow"){
              fontDirectory = path.join("./public/fonts", fontFamily);
            }else{
              fontDirectory = path.join("./public/fonts", fontFamily);
            }
          }
          if (!fs.existsSync(fontDirectory)) {
            fs.mkdirSync(fontDirectory, {recursive: true});
          }
          const fileName: string = `${fontFamily}_${style}_${weight}`;

          let newUrl: string = path.join(fontDirectory, fileName);
          newUrl = "'" + newUrl + fileExtension + "'";
          newUrl = newUrl.replace(/\\/g, "/");

          await downloadFontFile(url, fontDirectory, fileName);
          newFontCss = newFontCss.replace(url, newUrl);
          console.log(newFontCss);
        }
      }
      let fontsCssPath = ""
      if (config !== 404 && typeof config === "object" && config!==null) {
        if (config?.framework === "react" || "vue" || "unknow"){
          createDirectoryIfNeeded("src")
          createDirectoryIfNeeded("src/styles")
          fontsCssPath = "./src/styles/fonts.css";
        }else{
          createDirectoryIfNeeded("./styles")
          fontsCssPath = "./styles/fonts.css";
        }
      }
      fs.access(fontsCssPath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('Le fichier n\'existe pas. Création en cours...');
          fs.writeFile(fontsCssPath, newFontCss, (err) => {
            if (err) throw err;
            console.log('Le fichier a été créé !');
          });
        } else {
          const existingContent: string = fs.readFileSync(fontsCssPath, "utf8");
          fs.writeFileSync(fontsCssPath, newFontCss + existingContent);
        }
      });

      console.log(`La police ${fontFamily} a été téléchargée avec succès.`);
    } else {
      throw new Error("Aucune URL de police trouvée dans le CSS fourni.");
    }
  } catch (error: any) {
    console.error(
      `Erreur lors du téléchargement de la police ${fontFamily}: ${error.message}`
    );
  }
}

async function downloadFontFile(url: string, directory: string, fileName: string): Promise<void> {
  console.log(`Téléchargement de ${url} ...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Échec du téléchargement de l'URL : ${url}`);
    }
    const buffer: Buffer = await response.buffer();

    const fileExtension: string = path.extname(url);
    const savePath: string = path.join(directory, `${fileName}_family${fileExtension}`);

    fs.writeFileSync(savePath, buffer);
    console.log(`Téléchargement réussi et sauvegardé à ${savePath}`);
  } catch (error: any) {
    console.error(
      `Erreur lors du téléchargement du fichier de police : ${error.message}`
    );
  }
}

export async function initializeFontsDownload(): Promise<void> {
  try {
    const selectedFont: string = await selectFont();
    console.log(`Vous avez choisi de télécharger la police : ${selectedFont}`);
    await downloadFontFamily(selectedFont);
  } catch (error: any) {
    console.error(`Erreur lors de l'initialisation : ${error.message}`);
  }
}

