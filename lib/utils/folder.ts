import fs from 'fs';
export const createDirectoryIfNeeded = (path:string) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
};