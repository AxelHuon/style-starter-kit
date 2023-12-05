import fs from 'fs';
import path from 'path';
import * as process from "process";
import {initLib} from "../init/index.js";
import {initialisationColors} from "../colors/index.js";

export interface ConfigInterface {
  language?: string;
  framework?:string;
  styleLib?:string;
}


export const writeConfigFile = (key:string, value:string) =>{
  const configPath = path.join(process.cwd(), './', 'style-starter-kit.config.js');
  if (fs.existsSync(configPath)) {
    let configContent = fs.readFileSync(configPath, { encoding: 'utf8' });
    const regex = new RegExp(`${key}: '.*'`, 'g');
    if (regex.test(configContent)) {
      configContent = configContent.replace(regex, `${key}: '${value}'`);
    } else {
      configContent = configContent.replace(/};\s*$/, `  ${key}: '${value}',\n};\n`);
    }
    fs.writeFileSync(configPath, configContent, { encoding: 'utf8' });
  } else {
    const initialConfigContent = `export default {\n  ${key}: '${value}',\n};\n`;
    fs.writeFileSync(configPath, initialConfigContent, { encoding: 'utf8' });
    console.log("Le fichier de configuration a été créé.");
  }
}

export async function loadConfig(): Promise<ConfigInterface | number> {
  const configPath = path.join(process.cwd(), 'style-starter-kit.config.js');
  try {
    const module = await import(configPath);
    return module.default
  } catch (error) {
    console.log("Be carreful to launch style-starter-kit init before others commands")
    return 404
  }
}
