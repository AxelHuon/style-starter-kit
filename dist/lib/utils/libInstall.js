import { exec } from 'child_process';
import fs from 'fs';
export const installLibrary = (libraryName) => {
    let packageManager = fs.existsSync('yarn.lock') ? 'yarn add' : 'npm install';
    exec(`${packageManager} ${libraryName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'installation de ${libraryName}: ${error.message}`);
            return;
        }
        console.log(`Installation réussie de ${libraryName} avec ${packageManager}: ${stdout}`);
    });
};
