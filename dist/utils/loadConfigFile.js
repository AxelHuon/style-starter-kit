var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
export function loadConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const configPath = path.join(process.cwd(), 'style-starter-kit.config.js');
        try {
            const config = yield import(configPath);
            return config;
        }
        catch (error) {
            throw new Error('Impossible de charger la configuration');
        }
    });
}
loadConfig();
