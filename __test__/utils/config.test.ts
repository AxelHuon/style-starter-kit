import { loadConfig, writeConfigFile } from '../../lib/utils/configFile.ts';
import fs from 'fs';
import path from 'path';

describe('loadConfig', () => {
  it('charge correctement le fichier de configuration existant', () => {
    // Créez un fichier de configuration exemple pour le test
    const exampleConfig = {
      language: 'TypeScript',
      framework: 'nextjs',
      styleLib: 'styled-components',
    };

    // Chemin fictif pour le test
    const configPath = 'style-starter-kit.config.json';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(exampleConfig));

    // Appelez la fonction loadConfig
    const result = loadConfig();

    // Assurez-vous que la fonction renvoie la configuration attendue
    expect(result).toEqual(exampleConfig);

    // Restaurez les espions Jest pour fs
    jest.restoreAllMocks();
  });

  it("renvoie 404 si le fichier de configuration n'existe pas", () => {
    try {
      fs.unlinkSync('./style-starter-kit.config.json');
    } catch (err) {
      console.error('Erreur lors de la suppression du fichier de configuration existant :', err);
    }
    const config = loadConfig();
    expect(config).toEqual(404);
  });
});

describe('writeConfigFile', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("crée un nouveau fichier de configuration si celui-ci n'existe pas", () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    jest.spyOn(path, 'join').mockReturnValue('style-starter-kit.config.json');

    const key = 'newKey';
    const value = 'newValue';

    writeConfigFile(key, value);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'style-starter-kit.config.json',
      expect.any(String),
      { encoding: 'utf8' },
    );
  });

  it('met à jour un fichier de configuration existant', () => {
    const existingConfig = { existingKey: 'existingValue' };
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(existingConfig));
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    jest.spyOn(path, 'join').mockReturnValue('style-starter-kit.config.json');

    const key = 'newKey';
    const value = 'newValue';

    writeConfigFile(key, value);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'style-starter-kit.config.json',
      JSON.stringify({ ...existingConfig, [key]: value }, null, 2),
      { encoding: 'utf8' },
    );
  });

  it("affiche une erreur si la valeur n'est ni une chaîne ni un tableau", () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    writeConfigFile('key', 123 as unknown as string);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'La valeur doit être une chaîne de caractères ou un tableau de chaînes.',
    );
  });
});
