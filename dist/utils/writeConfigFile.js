import fs from 'fs';
import path from 'path';
export const writeConfigFile = (key, value) => {
    const configPath = path.join(process.cwd(), './', 'style-starter-kit.config.json');
    if (fs.existsSync(configPath)) {
        let configContent = fs.readFileSync(configPath, { encoding: 'utf8' });
        const regex = new RegExp(`${key}: '.*'`, 'g');
        if (regex.test(configContent)) {
            configContent = configContent.replace(regex, `${key}: '${value}'`);
        }
        else {
            configContent = configContent.replace(/};\s*$/, `  ${key}: '${value}',\n};\n`);
        }
        fs.writeFileSync(configPath, configContent, { encoding: 'utf8' });
    }
    else {
        const initialConfigContent = `export default {\n  ${key}: '${value}',\n};\n`;
        fs.writeFileSync(configPath, initialConfigContent, { encoding: 'utf8' });
        console.log("Le fichier de configuration a été créé.");
    }
};
