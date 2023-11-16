import inquirer from 'inquirer';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const FONTS: string[] = [
  "Roboto",
  // ... ajoutez d'autres polices si vous souhaitez les supporter
];

interface FontChoice {
  fontFamily: string;
}

async function selectFont(): Promise<string> {
  const questions = [
    {
      type: 'list',
      name: 'fontFamily',
      message: 'Quelle police souhaitez-vous télécharger?',
      choices: FONTS,
      default: FONTS[0],
    },
  ];

  const answers = await inquirer.prompt<FontChoice>(questions);
  return answers.fontFamily;
}

async function downloadFontFile(url: string, directory: string, fontFamily: string): Promise<void> {
  console.log(`Téléchargement de ${url} ...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Échec du téléchargement de l'URL : ${url}`);
    }
    const buffer = await response.buffer();

    const fileExtension = path.extname(url);
    const savePath = path.join(directory, `${fontFamily}_family${fileExtension}`);

    fs.writeFileSync(savePath, buffer);
    console.log(`Téléchargement réussi et sauvegardé à ${savePath}`);
  } catch (error) {
    console.error(`Erreur lors du téléchargement du fichier de police : ${(error as Error).message}`);
  }
}

async function downloadFont(fontFamily: string): Promise<void> {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap`;

  try {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du CSS de la police : ${fontUrl}`);
    }
    const fontCss = await response.text();

    const urlMatches = fontCss.match(/url\(['"]?([^'"]+)['"]?\)/g);
    console.log(urlMatches);
    if (urlMatches) {
      const fontDirectory = path.join('./src/fonts', fontFamily);
      if (!fs.existsSync(fontDirectory)) {
        fs.mkdirSync(fontDirectory, { recursive: true });
      }

      for (const match of urlMatches) {
        const urlMatch = match.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch) {
          //await downloadFontFile(urlMatch[1], fontDirectory, fontFamily);
        }
      }

      //console.log(`La police ${fontFamily} a été téléchargée avec succès.`);
    } else {
      throw new Error('Aucune URL de police trouvée dans le CSS fourni.');
    }
  } catch (error) {
    console.error(`Erreur lors du téléchargement de la police ${fontFamily}: ${(error as Error).message}`);
  }
}

async function initializeLibrary(): Promise<void> {
  try {
    const selectedFont = await selectFont();
    console.log(`Vous avez choisi de télécharger la police : ${selectedFont}`);
    await downloadFont(selectedFont);
  } catch (error) {
    console.error(`Erreur lors de l'initialisation : ${(error as Error).message}`);
  }
}

initializeLibrary();
