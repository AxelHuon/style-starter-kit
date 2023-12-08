import fs from 'fs';
import path from 'path';
import * as process from 'process';
export const writeConfigFile = (key, value) => {
    const configPath = path.join(process.cwd(), './', 'style-starter-kit.config.json');
    let configObject;
    if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, { encoding: 'utf8' });
        configObject = JSON.parse(configContent);
    }
    else {
        configObject = {};
        console.log('Le fichier de configuration a été créé.');
    }
    if (typeof value === 'string' || Array.isArray(value)) {
        configObject[key] = value;
        const newConfigContent = JSON.stringify(configObject, null, 2);
        fs.writeFileSync(configPath, newConfigContent, { encoding: 'utf8' });
    }
    else {
        console.error('La valeur doit être une chaîne de caractères ou un tableau de chaînes.');
    }
};
export function loadConfig() {
    const configPath = path.join(process.cwd(), 'style-starter-kit.config.json');
    if (fs.existsSync(configPath)) {
        const configFile = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configFile);
    }
    else {
        console.log('Be careful to launch style-starter-kit init before others commands');
        return 404;
    }
}
