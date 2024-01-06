import fs from 'fs';
export const createDirectoryIfNeeded = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        return true;
    }
    else {
        return false;
    }
};
