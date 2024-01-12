import { exec } from 'child_process';
import fs from 'fs';
export const installLibrary = (libraryName) => {
    const packageManager = fs.existsSync('yarn.lock') ? 'yarn add' : 'npm install';
    exec(`${packageManager} ${libraryName}`, (error, stdout) => {
        if (error) {
            console.error(`Error during the installation of ${libraryName}: ${error.message}`);
            return;
        }
        console.log(`Successful installation of ${libraryName} with ${packageManager}: ${stdout}`);
    });
};
