import fetch from 'node-fetch';
import fs from 'fs';
import { createDirectoryIfNeeded } from './folder.js';
import path from 'path';
import { loadConfig } from './configFile.js';

export interface ParsedFontsInterface {
  fontName: string;
  fontsData: FontsDataInterface[];
}

export interface FontsDataInterface {
  fontsVariant: string;
  fontsWeight: string;
  fontStyle: string;
  fontUrl: string;
}

export const getGooglFontsData = async (
  fontName: string,
): Promise<{ cssText?: string; fontName?: string; error?: string }> => {
  try {
    const response = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        fontName,
      )}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap`,
      { headers: { Accept: 'text/css' } },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cssText = await response.text();
    return {
      cssText,
      fontName,
    };
  } catch (error: any) {
    return {
      error: `Error fetching Google Fonts CSS:', ${error}}`,
    };
  }
};

export const parseFontsIntoJson = (cssText: string, fontName: string): ParsedFontsInterface => {
  const fontFaceRegex = /@font-face\s*\{([\s\S]*?)\}/g;
  const propertyRegex = /(font-(style|weight|display|family)|src):\s*([^;]+)/g;

  const fontsData: FontsDataInterface[] = [];
  let match;

  while ((match = fontFaceRegex.exec(cssText)) !== null) {
    const fontFace = match[1];
    const fontProperties: FontsDataInterface = {
      fontsVariant: '',
      fontsWeight: '',
      fontStyle: '',
      fontUrl: '',
    };

    let propertyMatch;
    while ((propertyMatch = propertyRegex.exec(fontFace)) !== null) {
      const [, property, , value] = propertyMatch;

      if (property === 'font-style') {
        fontProperties.fontStyle = value;
      } else if (property === 'font-weight') {
        fontProperties.fontsWeight = value;
      } else if (property === 'src') {
        const urlMatch = value.match(/url\(([^)]+)\)/);
        if (urlMatch) {
          fontProperties.fontUrl = urlMatch[1];
        }
      }
    }

    fontProperties.fontsVariant = `${fontName}_${fontProperties.fontStyle}_${fontProperties.fontsWeight}`;
    fontsData.push(fontProperties);
  }

  return {
    fontName,
    fontsData,
  };
};

export const downloadFont = async (
  url: string,
  fontsVariant: string,
): Promise<string | boolean> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

    const dir = './public/fonts';
    createDirectoryIfNeeded(dir);

    const extensionMatch = url.match(/\.(woff2|woff|ttf|otf|eot)$/);
    const extension = extensionMatch ? extensionMatch[0] : '.ttf';

    const filePath = path.join(dir, `${fontsVariant}${extension}`);

    const dest = fs.createWriteStream(filePath);
    if (response.body) {
      response.body.pipe(dest);
      dest.on('finish', () => console.log(`Font downloaded and saved as ${filePath}`));
      dest.on('error', (error: any) => console.error(`Error saving the file: ${error.message}`));
      return filePath;
    }
    return false;
  } catch (error: any) {
    console.error(`Error in downloadFont function: ${error.message}`);
    return false;
  }
};

export const genereateCSSContent = (
  filePath: string,
  fontsData: FontsDataInterface,
  fontName: string,
): string | boolean => {
  const config = loadConfig();
  let filePathUrlCss: string = '';
  if (typeof config === 'object') {
    if (
      config.framework === 'react' ||
      config.framework === 'vue' ||
      config.framework === 'unknown'
    ) {
      filePathUrlCss = `../../${filePath}`;
    } else if (config.framework === 'nextjs' || config.framework === 'nuxt') {
      filePathUrlCss = `../${filePath}`;
    }
    const content = `@font-face {\n font-family: '${fontName}';\n font-style: ${fontsData.fontStyle};\n font-weight: ${fontsData.fontsWeight};\n src: url('${filePathUrlCss}') format('ttf');\n}\n`;
    return content;
  } else {
    return false;
  }
};

export const addContentToCssFile = (content: string): boolean => {
  console.log("ici");
  const config = loadConfig();
  let dirCss: string = '';
  if (typeof config === 'object') {
    if (
      config.framework === 'react' ||
      config.framework === 'vue' ||
      config.framework === 'unknown'
    ) {
      dirCss = '/src/styles';
    } else if (config.framework === 'nextjs' || config.framework === 'nuxt') {
      dirCss = '/styles';
    }
    createDirectoryIfNeeded(process.cwd() + dirCss);
    const filePath = path.join(process.cwd(), `${dirCss}/fonts.css`);
    fs.appendFile(filePath, content, (err) => {
      if (err) {
        console.error(err);
        return false;
      }
    });
    return true;
  } else {
    return false;
  }
};
