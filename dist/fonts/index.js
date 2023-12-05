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
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { createDirectoryIfNeeded } from "../utils/folder.js";
import { loadConfig } from "../utils/configFile.js";
const FONTS = [
    "Roboto",
    "Open Sans",
    "Lato",
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
function downloadFontFamily(fontFamily) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield loadConfig();
        const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap`;
        console.log(fontUrl);
        try {
            const response = yield fetch(fontUrl);
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération du CSS de la police : ${fontUrl}`);
            }
            const fontCss = yield response.text();
            const fontFaceSections = fontCss.split(/@font-face\s*\{/);
            let newFontCss = fontCss;
            if (fontCss) {
                console.log(`Le CSS de la police ${fontFamily} a été récupéré avec succès.`);
                for (const section of fontFaceSections) {
                    const urlMatch = section.match(/url\(['"]?([^'"]+)['"]?\)/);
                    const weightMatch = section.match(/font-weight:\s*(\d+)/);
                    const styleMatch = section.match(/font-style:\s*(\w+)/);
                    if (urlMatch && weightMatch && styleMatch) {
                        const url = urlMatch[1];
                        const weight = weightMatch[1];
                        const style = styleMatch[1];
                        const fileExtension = path.extname(url);
                        let fontDirectory = "";
                        if (config !== 404 && typeof config === "object" && config !== null) {
                            if ((config === null || config === void 0 ? void 0 : config.framework) === "react" || "vue" || "unknow") {
                                fontDirectory = path.join("./public/fonts", fontFamily);
                            }
                            else {
                                fontDirectory = path.join("./public/fonts", fontFamily);
                            }
                        }
                        if (!fs.existsSync(fontDirectory)) {
                            fs.mkdirSync(fontDirectory, { recursive: true });
                        }
                        const fileName = `${fontFamily}_${style}_${weight}`;
                        let newUrl = path.join(fontDirectory, fileName);
                        newUrl = "'" + newUrl + fileExtension + "'";
                        newUrl = newUrl.replace(/\\/g, "/");
                        yield downloadFontFile(url, fontDirectory, fileName);
                        newFontCss = newFontCss.replace(url, newUrl);
                        console.log(newFontCss);
                    }
                }
                let fontsCssPath = "";
                if (config !== 404 && typeof config === "object" && config !== null) {
                    if ((config === null || config === void 0 ? void 0 : config.framework) === "react" || "vue" || "unknow") {
                        createDirectoryIfNeeded("src");
                        createDirectoryIfNeeded("src/styles");
                        fontsCssPath = "./src/styles/fonts.css";
                    }
                    else {
                        createDirectoryIfNeeded("./styles");
                        fontsCssPath = "./styles/fonts.css";
                    }
                }
                fs.access(fontsCssPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log('Le fichier n\'existe pas. Création en cours...');
                        fs.writeFile(fontsCssPath, newFontCss, (err) => {
                            if (err)
                                throw err;
                            console.log('Le fichier a été créé !');
                        });
                    }
                    else {
                        const existingContent = fs.readFileSync(fontsCssPath, "utf8");
                        fs.writeFileSync(fontsCssPath, newFontCss + existingContent);
                    }
                });
                console.log(`La police ${fontFamily} a été téléchargée avec succès.`);
            }
            else {
                throw new Error("Aucune URL de police trouvée dans le CSS fourni.");
            }
        }
        catch (error) {
            console.error(`Erreur lors du téléchargement de la police ${fontFamily}: ${error.message}`);
        }
    });
}
function downloadFontFile(url, directory, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Téléchargement de ${url} ...`);
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Échec du téléchargement de l'URL : ${url}`);
            }
            const buffer = yield response.buffer();
            const fileExtension = path.extname(url);
            const savePath = path.join(directory, `${fileName}_family${fileExtension}`);
            fs.writeFileSync(savePath, buffer);
            console.log(`Téléchargement réussi et sauvegardé à ${savePath}`);
        }
        catch (error) {
            console.error(`Erreur lors du téléchargement du fichier de police : ${error.message}`);
        }
    });
}
export function initializeFontsDownload() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = yield loadConfig();
            if (config !== 404) {
                const selectedFont = yield selectFont();
                console.log(`Vous avez choisi de télécharger la police : ${selectedFont}`);
                yield downloadFontFamily(selectedFont);
            }
        }
        catch (error) {
            console.error(`Erreur lors de l'initialisation : ${error.message}`);
        }
    });
}
