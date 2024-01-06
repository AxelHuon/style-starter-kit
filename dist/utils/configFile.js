import fs from 'fs';
import path from 'path';
import * as process from 'process';
export const writeConfigFile = (key, value, writeMode = 'replace') => {
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
    const updateConfig = (newValue) => {
        if (writeMode === 'replace') {
            configObject[key] = newValue;
        }
        else if (writeMode === 'appendToArray') {
            if (!configObject[key]) {
                configObject[key] = [newValue];
            }
            else if (Array.isArray(configObject[key])) {
                if (!configObject[key].includes(newValue)) {
                    configObject[key].push(newValue);
                }
            }
            else {
                configObject[key] = [configObject[key], newValue];
            }
        }
    };
    if (typeof value === 'string') {
        updateConfig(value);
    }
    else if (Array.isArray(value)) {
        value.forEach((val) => {
            if (typeof val === 'string') {
                updateConfig(val);
            }
            else {
                console.error('Tous les éléments du tableau doivent être des chaînes de caractères.');
            }
        });
    }
    else {
        console.error('La valeur doit être une chaîne de caractères ou un tableau de chaînes.');
    }
    const newConfigContent = JSON.stringify(configObject, null, 2);
    fs.writeFileSync(configPath, newConfigContent, { encoding: 'utf8' });
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
