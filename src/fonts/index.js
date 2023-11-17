var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import inquirer from "inquirer";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
const FONTS = [
  "Roboto",
  "Open Sans",
  "Lato",
  // ... ajoutez d'autres polices si vous souhaitez les supporter
];
function selectFont() {
  return __awaiter(this, void 0, void 0, function* () {
    const questions = [
      {
        type: "list",
        name: "fontFamily",
        message: "Quelle police souhaitez-vous télécharger?",
        choices: FONTS,
        default: FONTS[0],
      },
    ];
    const answers = yield inquirer.prompt(questions);
    return answers.fontFamily;
  });
}

async function downloadFontFamily(fontFamily) {
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

    const fontCss = await response.text();
    const fontFaceSections = fontCss.split(/@font-face\s*\{/);
    let completeFontCSS = '';
    if (fontCss) {
      console.log(
        `Le CSS de la police ${fontFamily} a été récupéré avec succès.`
      );
      for (const section of fontFaceSections) {

        const urlMatch = section.match(/url\(['"]?([^'"]+)['"]?\)/);
        const weightMatch = section.match(/font-weight:\s*(\d+)/);
        const styleMatch = section.match(/font-style:\s*(\w+)/);

        if (urlMatch && weightMatch && styleMatch) {
          const url = urlMatch[1];
          const weight = weightMatch[1];
          const style = styleMatch[1];

          const fontDirectory = path.join("./src/fonts", fontFamily);
          if (!fs.existsSync(fontDirectory)) {
            fs.mkdirSync(fontDirectory, { recursive: true });
          }

          const fileName = `${fontFamily}_${style}_${weight}`;
          completeFontCSS += `@font-face { font-family: '${fontFamily}'; font-style: ${style}; font-weight: ${weight}; src: url('${path.join(fontDirectory, fileName)}'); }\n`;
          console.log(completeFontCSS)
          //await downloadFontFile(url, fontDirectory, fileName);
        }
      }
      console.log(`La police ${fontFamily} a été téléchargée avec succès.`);
    } else {
      throw new Error("Aucune URL de police trouvée dans le CSS fourni.");
    }
  } catch (error) {
    console.error(
      `Erreur lors du téléchargement de la police ${fontFamily}: ${error.message}`
    );
  }
}

async function downloadFontFile(url, directory, fileName) {
  console.log(`Téléchargement de ${url} ...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Échec du téléchargement de l'URL : ${url}`);
    }
    const buffer = await response.buffer();

    const fileExtension = path.extname(url);
    const savePath = path.join(
      directory,
      `${fileName}_family${fileExtension}`
    );

    fs.writeFileSync(savePath, buffer);
    console.log(`Téléchargement réussi et sauvegardé à ${savePath}`);
  } catch (error) {
    console.error(
      `Erreur lors du téléchargement du fichier de police : ${error.message}`
    );
  }
}

async function initializeLibrary() {
  try {
    const selectedFont = await selectFont();
    console.log(`Vous avez choisi de télécharger la police : ${selectedFont}`);
    await downloadFontFamily(selectedFont);
  } catch (error) {
    console.error(`Erreur lors de l'initialisation : ${error.message}`);
  }
}
initializeLibrary();
